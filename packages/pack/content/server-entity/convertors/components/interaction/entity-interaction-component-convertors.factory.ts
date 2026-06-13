import { convertEquipItemComponent } from './equip-item-component.convertor';
import { convertEquipmentComponent } from './equipment-component.convertor';
import { convertEquippableComponent } from './equippable-component.convertor';
import { convertGiveableComponent } from './giveable-component.convertor';
import { convertInteractComponent } from './interact-component.convertor';
import { convertInventoryComponent } from './inventory-component.convertor';
import { convertItemHopperComponent } from './item-hopper-component';
import { convertOnEquipmentChangedComponent } from './on-equipment-changed-component.convertor';
import { convertSittableComponent } from './sittable-component.convertor';

export const entityInteractionComponentConvertorsFactory = {
  equipItem: convertEquipItemComponent,
  equipment: convertEquipmentComponent,
  equippable: convertEquippableComponent,
  giveable: convertGiveableComponent,
  interact: convertInteractComponent,
  inventory: convertInventoryComponent,
  itemHopper: convertItemHopperComponent,
  onEquipmentChanged: convertOnEquipmentChangedComponent,
  sittable: convertSittableComponent,
};
