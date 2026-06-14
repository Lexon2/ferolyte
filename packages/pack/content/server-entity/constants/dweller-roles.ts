export type DwellerRole = 'farmer' | 'fisherman' | 'shepherd' | 'fletcher' | 'librarian' | 'cartographer' | 'cleric' | 'armorer' | 'weapon_smith' | 'tool_smith' | 'butcher' | 'leatherworker' | 'mason' | 'nitwit' | 'unemployed' | 'hostile' | 'passive' | 'neutral' | 'boss' | 'miniboss' | 'common' | 'rare' | 'epic' | 'legendary';

export const DWELLER_ROLES: readonly DwellerRole[] = [
  'farmer',
  'fisherman',
  'shepherd',
  'fletcher',
  'librarian',
  'cartographer',
  'cleric',
  'armorer',
  'weapon_smith',
  'tool_smith',
  'butcher',
  'leatherworker',
  'mason',
  'nitwit',
  'unemployed',
  'hostile',
  'passive',
  'neutral',
  'boss',
  'miniboss',
  'common',
  'rare',
  'epic',
  'legendary'
] as const;
