import type { AppState, FaceMode, TimeOfDay } from './types';
import * as THREE from 'three';
/* ================= 定数 ================= */
const TAU = Math.PI * 2;
const FR = 1.25;
const PITCH = 35 * Math.PI / 180;
const SINP = Math.sin(PITCH), COSP = Math.cos(PITCH);
const STEP = 1 / 60;
const CYCLE = 0.64, WALK_V = 2.8, LEG_LEN = 0.545;
const PLAYER_R = 0.3;                                // 胴体と足元の幅
const CHAR_FOOT_R = 0.15;                            // キャラの前後判定に使う足元の半径
const SPRITE_NEAR = 3.4, SPRITE_FAR = 6.6, WORLD_DIST = 50, WORLD_NEAR = 20, WORLD_FAR = 80;
const TW = 1.25, TD = TW / SINP, TH = TW / COSP;
const MC = 40, MR = 24;
const DIR_NAMES = ['下','右下','右','右上','上','左上','左','左下'];
const DIR8 = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
const DIR_HYST = (22.5 + 10) * Math.PI / 180;
const DIR_HOLD = 8;
const LIGHT_W = new THREE.Vector3(-0.6, 1.0, 0.35).normalize();
const CAM_TARGET = new THREE.Vector3(0, 0.95, 0);
const CAM_DIR = new THREE.Vector3(0, SINP, COSP);
const SHADOW_SIZE = 1024, SHADOW_EXT = 24;
const CARD = { TRUE:0, NEAR:1, FAR:2, GROUND:3 };    // 深度ルール
const STAGES = [
  {label:'素の縮小', f:[0,0,0,0]},
  {label:'＋1 階調', f:[1,0,0,0]},
  {label:'＋2 α',   f:[1,1,0,0]},
  {label:'＋3 輪郭', f:[1,1,1,0]},
  {label:'＋4 対策', f:[1,1,1,1]},
];
const FACES: { k: FaceMode; label: string }[] = [ {k:'3d', label:'3D形状'}, {k:'uv', label:'UVデカール'}, {k:'pixel', label:'ドット顔'} ];
const GLYPH_COLORS: Record<string, string> = { D:'#241a38', W:'#fffaf0', C:'#3f5aa6', K:'#c98b6e' };
const GLYPHS: Record<number, { w: number; h: number; eye: string[]; narrow: string[] }> = {
  16:{ w:1, h:1, eye:['D'], narrow:['D'] },
  24:{ w:1, h:2, eye:['D','D'], narrow:['D','D'] },
  32:{ w:2, h:3, eye:['DW','DD','CC'], narrow:['D.','D.','C.'] },
  48:{ w:3, h:4, eye:['DDD','DCW','DCC','.DD'], narrow:['DD.','DC.','DC.','.D.'] },
};
const ATLAS_COLS = 10;
const BROWS: Record<number, { angryL: string[]; angryR: string[]; sadL: string[]; sadR: string[] }> = {
  2:{ angryL:['D.','.D'], angryR:['.D','D.'], sadL:['.D','D.'], sadR:['D.','.D'] },
  3:{ angryL:['DD.','..D'], angryR:['.DD','D..'], sadL:['..D','DD.'], sadR:['D..','.DD'] },
};
const ICON_COLORS: Record<string, string> = { K:'#2a1f3d', W:'#ffffff', R:'#e04848', Y:'#f5c84a', B:'#6ab4f0' };
const ICONS: { rows: string[]; ox: number; oy: number; drift?: boolean }[] = [
  { rows:['....KKK..','....KYKK.','....KYYYK','....KYKKK','....KYK..','..KKKYK..','.KYYYYK..','.KYYYK...','..KKK....'], ox:2, oy:0 },
  { rows:['...KKK...','..KRRRK..','..KRRRK..','...KRK...','...KRK...','....K....','...KKK...','...KRK...','...KKK...'], ox:0, oy:0 },
  { rows:['..KKKKK..','.KWWWWWK.','.KWKKKWK.','..K..KWK.','....KWK..','....KWK..','....KKK..','....KWK..','....KKK..'], ox:0, oy:0 },
  { rows:['.........','.........','.........','.........','KKKKKKKKK','KWKKWKKWK','KKKKKKKKK','.........','.........'], ox:0, oy:-2 },
  { rows:['.KK...KK.','KRRK.KRRK','KRK...KRK','.K.....K.','.........','.K.....K.','KRK...KRK','KRRK.KRRK','.KK...KK.'], ox:4, oy:0 },
  { rows:['....K....','...KBK...','...KBK...','..KBBBK..','..KBWBK..','.KBWBBBK.','.KBBBBBK.','..KBBBK..','...KKK...'], ox:7, oy:-7, drift:true },
];
const EMOTES = {
  joy:{ icon:0, motion:'hop', eye:1, brow:-1, dur:1.8 },
  surprise:{ icon:1, motion:'jolt', eye:0, brow:-1, dur:1.6 },
  question:{ icon:2, motion:'tilt', eye:0, brow:1, dur:2.0 },
  sad:{ icon:3, motion:'slump', eye:1, brow:1, dur:2.4 },
  angry:{ icon:4, motion:'stomp', eye:0, brow:0, dur:1.8 },
  sweat:{ icon:5, motion:'fidget', eye:0, brow:1, dur:2.0 },
};
// 描き込み層（手描きのドット絵）
const DECAL_COLORS: Record<string, string> = { K:'#2a2238', k:'#4a3f55', W:'#f4f1ea', w:'#c9c4b8', g:'#8a8478', B:'#4b8fd0', b:'#8fc3ec',
  R:'#d8443f', r:'#9c2f3a', Y:'#f2c94c', G:'#3f7f3a', N:'#7a5032', n:'#553722', T:'#c9a46b', O:'#e98a3a' };
const SPRITES = {
  crack:['..k......','.k.k.....','k...kk.k.','.....k.k.','......k..'],
  puddle:['...bbbbbb...','.bbBBBBBBbb.','bBBBBWBBBBBb','.bbBBBBBBbb.','...bbbbbb...'],
  pebbles:['.w...w.','wgw.wgw','.g..ggw','...w.g.'],
  tulips:['R...R...R','r.R.r.R.r','G.r.G.r.G','G.G.G.G.G','.G.G.G.G.'],
  mushroom:['.RRR.','RWRWR','RRRRR','..W..','.wWw.'],
  leaves:['.O....N.','OOn..NN.','.n..O...','...OOn..'],
  shopSign:['..k......k..','KKKKKKKKKKKK','KTTTTwwTTTTK','KTTTTkkTTTTK','KTTTkBBkTTTK','KTTkBbBBkTTK','KTTkBBBBkTTK','KTTTkkkkTTTK','KKKKKKKKKKKK'],
};
const DECALS: [keyof typeof SPRITES, number, number, number, number][] = [
  ['crack', -1.5, 0, -1.0, 4], ['crack', 2.0, 0, 1.8, 4], ['puddle', 6.5, 0, 0.3, 4],
  ['pebbles', -12, 0, 0.6, 4], ['pebbles', 0.3, 0, -8.0, 4],
  ['tulips', -2.6, 0, 5.2, 4], ['tulips', 12.5, 0, -2.4, 4], ['tulips', -12.5, 0, 3.6, 4],
  ['mushroom', -12.6, 0, -9.5, 4], ['mushroom', 15.6, 0, 3.9, 4],
  ['leaves', 13.5, 0, -10.7, 4], ['leaves', -14.3, 0, 11.3, 4],
  ['shopSign', 9.9, 1.0, -5.0, 1],
];
const TOD: Record<TimeOfDay, { dir: [number, number, number]; col: [number, number, number]; int: number; amb: number; lamps: number; decal: number }> = {
  day:{ dir:[-0.6, 1.0, 0.35], col:[1, 1, 1], int:1, amb:0, lamps:0, decal:1 },
  evening:{ dir:[-1.0, 0.6, 0.3], col:[1.0, 0.8, 0.62], int:0.92, amb:0.04, lamps:0.7, decal:0.9 },
  night:{ dir:[-0.45, 1.0, 0.3], col:[0.55, 0.66, 0.95], int:0.6, amb:0.12, lamps:1, decal:0.65 },
};
const P = { none:0, brick:1, plankH:2, plankV:3, shingle:4, stone:5, bark:6 };
const T = { grass:0, meadow:1, dirt:2, sand:3, cobble:4, water:5 };

const state: AppState = { S:32, dot:4, face:'pixel', f1:true, f2:true, f3:true, f4:true, auto:true, compare:false, tod:'day', shadow:true };
const texel = () => (2 * FR) / state.S;


export { TAU, FR, SINP, COSP, STEP, CYCLE, WALK_V, LEG_LEN, PLAYER_R, CHAR_FOOT_R, SPRITE_NEAR, SPRITE_FAR, WORLD_DIST, WORLD_NEAR, WORLD_FAR, TW, TD, TH, MC, MR, DIR_NAMES, DIR8, DIR_HYST, DIR_HOLD, LIGHT_W, CAM_TARGET, CAM_DIR, SHADOW_SIZE, SHADOW_EXT, CARD, STAGES, FACES, GLYPH_COLORS, GLYPHS, ATLAS_COLS, BROWS, ICON_COLORS, ICONS, EMOTES, DECAL_COLORS, SPRITES, DECALS, TOD, P, T, state, texel };
