// Issue #10: opt-in comparison only. These are not adopted rendering defaults.
export type CharacterVariant = 'baseline' | 'anchored' | 'precise';
export const characterStudy = {
  variant: 'baseline' as CharacterVariant,
  freezePose: false,
  fixedCamera: false,
};
