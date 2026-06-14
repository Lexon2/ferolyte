import {
  ItemKineticWeaponConditions,
  ItemWeaponReachRange,
} from '../../types/item-weapon-reach';

/**
 * Interface for the kinetic_weapon component
 */
export interface ItemKineticWeaponComponent {
  creativeReach?: ItemWeaponReachRange;
  damageConditions?: ItemKineticWeaponConditions;
  damageModifier?: number;
  damageMultiplier?: number;
  delay?: number;
  dismountConditions?: ItemKineticWeaponConditions;
  hitboxMargin?: number;
  knockbackConditions?: ItemKineticWeaponConditions;
  reach?: ItemWeaponReachRange;
}
