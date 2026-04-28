export interface BookFilterSettings {
  maxPremium: string;
  maxBond: string;
}

export const defaultBookFilterSettings: BookFilterSettings = {
  maxPremium: '',
  maxBond: '',
};
