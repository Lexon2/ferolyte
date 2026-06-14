import { DamageSourceType } from '../../../constants/damage-source-types';
import { EntityFilters } from '../../filters';

/**
 * Interface for the hurt_on_condition component
 * Defines a set of conditions under which an entity should take damage.
 */
export interface HurtOnConditionComponent {
  /**
   * An array of conditions used to compare the event to
   */
  damageConditions: HurtOnConditionDamageCondition[];
}

/**
 * Interface for the hurt_on_condition component damage condition
 * Defines a condition used to compare the event to
 */
export interface HurtOnConditionDamageCondition {
  /**
   * A condition used to compare the event to
   */
  filters?: EntityFilters;

  /**
   * Damage cause
   */
  cause?: DamageSourceType;

  /**
   * Amount of damage done each tick that the conditions are met
   */
  damagePerTick: number;
}
