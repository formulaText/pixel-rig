// Issue #10: adopted B is the normal default; explicit comparisons are temporary.
export type CharacterVariant = 'baseline' | 'anchored' | 'precise';
export type CharacterSelection = 'default' | CharacterVariant;
export const DEFAULT_CHARACTER_VARIANT: CharacterVariant = 'precise';
export const characterStudy = {
  selection: 'default' as CharacterSelection,
  get variant(): CharacterVariant {
    return this.selection === 'default' ? DEFAULT_CHARACTER_VARIANT : this.selection;
  },
  // Direct variant assignment is an explicit comparison, never a saved default.
  set variant(value: CharacterVariant) { this.selection = value; },
  freezePose: false,
  fixedCamera: false,
};
