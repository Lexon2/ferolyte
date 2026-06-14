import { DamageSourceType } from '../../../constants/damage-source-types';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the on_hurt component
 * Adds a trigger to call when this entity takes damage.
 */
export interface OnHurtComponent extends EntityEventTrigger {
  /**
   * Damage sources that should trigger this event
   */
  damageSources?: DamageSourceType[];
}
