import {scaleResearchStamps} from './face-stamps';
import {sampleLookMeasurement,interruptLookMeasurement} from './performance';
import {applyResearchFace,restoreResearchFace} from './face-render';
import * as THREE from 'three';
import {state,STEP,TAU,CYCLE,texel,SINP,COSP} from '../core/constants';
import {research,effectiveLook,BASE} from './model';
import {ReplayClock,presets,inputAt} from '../debug/replay';
import {characterStudy} from '../debug/character-study';
import {leaveValidation,active as validationActive} from '../debug/validation';
import {tick,resetLogic,applyPose,simTime,idleT} from '../gameplay/logic';
import {player,setPlayerWorld} from '../gameplay/player';
import {resetInput,setReplayInput} from '../input/input';
import {seedRuntime} from '../core/random';
import {J,idlePose,walkPose,setFace} from '../character/rig';
import {expr} from '../character/expression';
import {shared} from '../materials/shared';
import {renderWorld,rebuild,resize,W,H,rtWHi} from '../render/scene';
import {worldScene,resetWorld} from '../world/world';
import {decalScene} from '../world/decals';
import {renderer,canvas} from '../render/renderer';
import {postMat,postScene,postCam} from '../render/post';
export const lookClock=new ReplayClock(STEP);
let saved:typeof state|null=null,blink=true;
export function enterLook(){
 if(research.active)return;
 if(validationActive)leaveValidation();saved={...state};blink=expr.autoBlink;
 research.active=true;characterStudy.selection='default';state.auto=false;state.compare=false;state.face='pixel';state.S=32;state.dot=4;state.shadow=true;
 document.body.classList.add('look-active');document.getElementById('look-panel')!.hidden=false;
 document.getElementById('normal-controls')!.hidden=true;document.getElementById('validation')!.hidden=true;
 resetLook();rebuild();resize();
}
export function resetLook(){
 lookClock.reset();resetLogic();resetInput();seedRuntime(11);resetWorld(11);setPlayerWorld(0,2.5);
 expr.seq=[];expr.seqT=0;expr.emote=null;expr.blinkWait=2.5;shared.uTime.value=0;
}
export function exitLook(){
 interruptLookMeasurement('通常操作へ戻りました');research.active=false;restoreResearchFace();lookClock.reset();J.head.position.y=.56;J.head.scale.setScalar(1);
 worldScene.visible=decalScene.visible=true;characterStudy.selection='default';
 if(saved)Object.assign(state,saved);expr.autoBlink=blink;expr.seq=[];expr.emote=null;
 resetLogic();resetInput();setReplayInput(null);seedRuntime(null);resetWorld(11);setPlayerWorld(0,2.5);
 postMat.uniforms.uResearchStamp.value=0;postMat.uniforms.uLookOn.value=0;postMat.uniforms.uMouth.value.set(0,0,0,0);
 document.body.classList.remove('look-active');document.getElementById('look-panel')!.hidden=true;
 document.getElementById('normal-controls')!.hidden=false;document.getElementById('validation')!.hidden=false;
 canvas.style.transform='';rebuild();resize();
}
function researchTick(i:number){
 const p=research.preview,m=p.motion;
 const inputs=m==='vertical'?presets['color-vertical'].inputs:m==='diagonal'?presets['color-diagonal'].inputs:[{seconds:4,x:0,y:0}];
 setReplayInput(inputAt(inputs,i%240,STEP));expr.autoBlink=p.blink;tick(i*STEP*1000);
}
export function seekLook(ticks:number){resetLook();for(let i=0;i<ticks;i++)lookClock.single(researchTick);}
export async function seekLongLook(ticks:number,progress:(n:number)=>void){resetLook();for(let i=0;i<ticks;){const end=Math.min(ticks,i+3000);for(;i<end;i++)lookClock.single(researchTick);progress(i/ticks);await new Promise(resolve=>setTimeout(resolve,0));}}
export function stepLook(){lookClock.pause();lookClock.single(researchTick);}
export function renderLook(dt=0){
 if(!research.active)return false;
 const cpuStart=performance.now(),updates=lookClock.advance(dt,researchTick);const p=research.preview,v=effectiveLook();
 state.tod=p.light;state.face='pixel';characterStudy.selection='default';
 const t=lookClock.seconds,dir=p.autoDirection?Math.floor(t/2)%8:p.direction;
 setFace('pixel');J.head.position.y=.56;
 if(p.motion==='vertical'||p.motion==='diagonal')applyPose(true);
 else if(p.motion==='walk')walkPose(Math.floor(t/CYCLE*4)%4/4);
 else {
  const b=p.motion==='still'?-1:(Math.floor(idleT*v.idleSpeed/.6)%2?1:-1);
  idlePose(b);const dy=J.torso.position.y;
  J.torso.position.y=dy*v.bodyIdle;J.head.position.y=.56+dy*(v.headIdle-v.bodyIdle);J.head.rotation.x*=v.headIdle;
 }
 J.head.rotation.x-=v.headTilt*Math.PI/180;applyResearchFace();
 if(p.eyes==='closed'){expr.seq=[[2,999]];}else if(p.eyes==='open'||!p.blink){expr.seq=[];}
 J.motion.position.set(0,0,0);J.motion.rotation.set(0,0,0);
 J.root.rotation.y=dir*TAU/8;
 const X=player.gx*texel(),Z=player.gy*texel()/SINP;
 J.root.position.set(X,0,Z);shared.uTime.value=simTime;
 worldScene.visible=decalScene.visible=p.background==='map';
 const u=postMat.uniforms;u.uLookOn.value=1;u.uLookInk.value.set(v.outlineColor);if(v.outlineColor===BASE.outlineColor)u.uLookInk.value.setRGB(.10,.06,.17);
 u.uLookInnerInk.value.set(v.innerOutlineColor);if(v.innerOutlineColor===BASE.innerOutlineColor)u.uLookInnerInk.value.setRGB(.10,.06,.17);
 u.uLookOpacity.value.set(v.outerOpacity,v.innerOpacity);u.uLookMode.value=v.outlineMode==='underpaint'?1:v.outlineMode==='inset'?2:0;
 const high=p.view==='3d', scale=high?4:1;if(canvas.width!==W*scale||canvas.height!==H*scale)renderer.setSize(W*scale,H*scale,false);
 renderWorld({f1:!high,f2:!high,f3:!high,face:'pixel'},X,Z,Math.round(player.gx),-Math.round(player.gy)+Math.round(.9*COSP/texel()),player.gx,player.gy,{blob:p.background==='map',skipComposite:high});
 if(high){
  u.tColor.value=rtWHi.texture;u.uF2.value=1;u.uF3.value=0;u.uRes.value.set(W*4,H*4);u.uGlyph.value.multiplyScalar(4);
  for(const k of ['uEye0','uEye1','uBrow0','uBrow1']){u[k].value.x*=4;u[k].value.y*=4;}
  scaleResearchStamps(4);u.uMouth.value.multiplyScalar(4);renderer.setRenderTarget(null);renderer.clear();renderer.render(postScene,postCam);u.uGlyph.value.multiplyScalar(.25);
 }
 canvas.style.transform=p.zoom===1?'':`scale(${p.zoom})`;canvas.style.transformOrigin='50% 65%';
 const status=document.getElementById('look-time');if(status)status.textContent=`${research.baseline?'基準':'調整中'} · ${lookClock.paused?'停止':'再生'} ${t.toFixed(2)}秒 · ${dir+1}/8方向 · ${p.view==='dot'?'ドット絵':'3D確認'}`;
 sampleLookMeasurement(performance.now(),performance.now()-cpuStart,updates);
 return true;
}
