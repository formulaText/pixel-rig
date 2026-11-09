import * as THREE from 'three';
import {J,idlePose,walkPose} from '../character/rig';
// Research front view uses one neutral head frame across locomotion modes.
// Derive the offset from the real rig poses, not a visual compensation constant.
let restOffset:THREE.Matrix4|null=null;
const identity=new THREE.Quaternion(),q=new THREE.Quaternion(),target=new THREE.Quaternion(),p=new THREE.Vector3(),scale=new THREE.Vector3(),offset=new THREE.Matrix4();
function neutralOffset(){
 const joints=[J.hips,J.torso,J.head,J.armL,J.armR,J.legL,J.legR,J.tail];
 const saved=joints.map(j=>({p:j.position.clone(),q:j.quaternion.clone(),s:j.scale.clone()}));
 const headFrame=()=>{for(const j of [J.hips,J.torso,J.head])j.updateMatrix();return new THREE.Matrix4().multiplyMatrices(J.hips.matrix,J.torso.matrix).multiply(J.head.matrix);};
 J.head.position.set(0,.56,0);J.head.scale.setScalar(1);
 idlePose(0);J.torso.position.y=0;const idle=headFrame(); // zero idle displacement
 walkPose(0);const walk=headFrame();
 joints.forEach((j,i)=>{j.position.copy(saved[i].p);j.quaternion.copy(saved[i].q);j.scale.copy(saved[i].s);j.updateMatrix();});
 return walk.invert().multiply(idle);
}
export function alignFrontWalkHead(weight:number){
 if(weight<=0)return;
 restOffset??=neutralOffset();restOffset.decompose(p,target,scale);
 p.multiplyScalar(weight);q.copy(identity).slerp(target,weight);
 offset.compose(p,q,scale.setScalar(1));
 // Post-multiply only the rest-frame difference. Walk yaw, bob and all limbs remain.
 J.head.updateMatrix();J.head.matrix.multiply(offset).decompose(J.head.position,J.head.quaternion,J.head.scale);
}
