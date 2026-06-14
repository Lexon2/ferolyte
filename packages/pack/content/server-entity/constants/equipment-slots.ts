/**
 * Equipment slot types
 */
export type FilterEquipmentSlot =
  | 'mainhand'
  | 'offhand'
  | 'head'
  | 'chest'
  | 'legs'
  | 'feet'
  | 'hand'
  | 'any';

/**
 * Available equipment slots
 */
export const FILTER_EQUIPMENT_SLOTS: readonly FilterEquipmentSlot[] = [
  'mainhand',
  'offhand',
  'hand',
  'head',
  'chest',
  'legs',
  'feet',
  'any',
];

export type EquipmentSlot =
  | 'slot.weapon.mainhand'
  | 'slot.weapon.offhand'
  | 'slot.armor.head'
  | 'slot.armor.chest'
  | 'slot.armor.legs'
  | 'slot.armor.feet'
  | 'slot.armor.body'
  | 'slot.hotbar'
  | 'slot.inventory'
  | 'slot.enderchest'
  | 'slot.saddle'
  | 'slot.armor'
  | 'slot.chest'
  | 'slot.equippable';

export const EQUIPMENT_SLOTS: readonly EquipmentSlot[] = [
  'slot.weapon.mainhand',
  'slot.weapon.offhand',
  'slot.armor.head',
  'slot.armor.chest',
  'slot.armor.legs',
  'slot.armor.feet',
  'slot.armor.body',
  'slot.hotbar',
  'slot.inventory',
  'slot.enderchest',
  'slot.saddle',
  'slot.armor',
  'slot.chest',
  'slot.equippable',
];
