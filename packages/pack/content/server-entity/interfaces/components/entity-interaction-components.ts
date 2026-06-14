import {
  EquipItemComponent,
  EquipmentComponent,
  EquippableComponent,
  GiveableComponent,
  InteractComponent,
  ItemHopperComponent,
  InventoryComponent,
  OnEquipmentChangedComponent,
  SittableComponent,
} from './interaction';

export interface EntityInteractionComponents {
  equipItem?: EquipItemComponent;
  equipment?: EquipmentComponent;
  equippable?: EquippableComponent;
  giveable?: GiveableComponent;
  interact?: InteractComponent;
  itemHopper?: ItemHopperComponent;
  inventory?: InventoryComponent;
  onEquipmentChanged?: OnEquipmentChangedComponent;
  sittable?: SittableComponent;
}
