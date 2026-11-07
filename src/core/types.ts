export type Resolution = 16 | 24 | 32 | 48;
export type FaceMode = '3d' | 'uv' | 'pixel';
export type TimeOfDay = 'day' | 'evening' | 'night';
export type EmoteKey = 'joy' | 'surprise' | 'question' | 'sad' | 'angry' | 'sweat';
export interface RenderOptions { f1: boolean; f2: boolean; f3: boolean; face: FaceMode }
export interface SpriteOptions extends RenderOptions { angle: number; subX: number; subY: number }
export interface AppState extends RenderOptions { S: Resolution; dot: number; f4: boolean; auto: boolean; compare: boolean; tod: TimeOfDay; shadow: boolean }
