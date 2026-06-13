import { ItemWeaponReachRange } from '../../types/item-weapon-reach';

/**
 * Interface for the piercing_weapon component
 */
export interface ItemPiercingWeaponComponent {
  creativeReach?: ItemWeaponReachRange;
  hitboxMargin?: number;
  reach?: ItemWeaponReachRange;
}
