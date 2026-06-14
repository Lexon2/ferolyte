export { createItem } from './create-item';

export { ItemBuilder } from './item-builder';

export type { ItemComponents, ItemConfig } from './interfaces/item-config';

export type { ItemMenuCategory } from './interfaces/item-menu-category';

export type { MinecraftItem } from './interfaces/minecraft-item';

export type { ItemDiggerComponent } from './interfaces/components/digger';

export type { ItemDurabilitySensorComponent } from './interfaces/components/durability-sensor';

export type { ItemKineticWeaponComponent } from './interfaces/components/kinetic-weapon';

export type { ItemPiercingWeaponComponent } from './interfaces/components/piercing-weapon';

export type { ItemRecordComponent } from './interfaces/components/record';

export type { ItemRepairableComponent } from './interfaces/components/repairable';

export type { ItemSwingSoundsComponent } from './interfaces/components/swing-sounds';

export * from './types/item-enchantable-slots';

export * from './types/item-hover-text-color';

export * from './types/item-menu-category-groups';

export * from './types/item-menu-category-type';

export * from './types/item-rarity';

export * from './types/item-tags';

export * from './types/item-use-animation';

export * from './types/item-versions';

export * from './types/item-wearable-slot';

export * from './types/item-weapon-reach';

export * from './utils/resolve-item-icon';

export * from './convertors/components';

export {
  convertMenuCategory,
  validateCategory,
} from './convertors/components/menu-category/convert-category';

export {
  convertWeaponReach,
  convertKineticWeaponConditions,
} from './convertors/components/utils/weapon-reach';
