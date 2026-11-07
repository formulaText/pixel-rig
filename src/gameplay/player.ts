import { texel, SINP } from '../core/constants';
/* ================= 状態・再構築 ================= */
const player = { gx:0, gy:0 };
function setPlayerWorld(x: number, z: number){ const tx = texel(); player.gx = Math.round(x / tx); player.gy = Math.round(z * SINP / tx); }
setPlayerWorld(0, 2.5);

export { player, setPlayerWorld };
