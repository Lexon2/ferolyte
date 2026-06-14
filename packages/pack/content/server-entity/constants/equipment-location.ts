export type EquipmentLocation =
  | 'any'
  | 'armor'
  | 'feet'
  | 'hand'
  | 'head'
  | 'inventory'
  | 'leg'
  | 'torse';

export const EQUIPMENT_LOCATION_VALUES: readonly EquipmentLocation[] = [
  'any',
  'armor',
  'feet',
  'hand',
  'head',
  'inventory',
  'leg',
  'torse',
];
