export { createItem } from './create-item';

export { ItemBuilder } from './item-builder';

export type { ItemComponents, ItemConfig } from './interfaces/item-config';

export type { ItemMenuCategory } from './interfaces/item-menu-category';

export type { MinecraftItem } from './interfaces/minecraft-item';

export * from './types/item-enchantable-slots';

export * from './types/item-hover-text-color';

export * from './types/item-menu-category-groups';

export * from './types/item-menu-category-type';

export * from './types/item-rarity';

export * from './types/item-tags';

export * from './types/item-use-animation';

export * from './types/item-versions';

export * from './types/item-wearable-slot';

export {
  convertMenuCategory,
  validateCategory,
} from './convertors/components/menu-category/convert-category';


// Pre-codegen names of the typed item components.
export type {
  DiggerComponent as ItemDiggerComponent,
  DurabilitySensorComponent as ItemDurabilitySensorComponent,
  KineticWeaponComponent as ItemKineticWeaponComponent,
  PiercingWeaponComponent as ItemPiercingWeaponComponent,
  RecordComponent as ItemRecordComponent,
  RepairableComponent as ItemRepairableComponent,
  SwingSoundsComponent as ItemSwingSoundsComponent,
} from '../generated/item/components';
