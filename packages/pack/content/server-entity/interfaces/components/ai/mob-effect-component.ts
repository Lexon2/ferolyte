import { EntityFilters } from '../../filters';

/**
 * Interface for the mob_effect component
 * Defines an effect that this entity can apply to other entities
 */
export interface MobEffectComponent {
  /**
   * Range in blocks within which the entity applies the effect
   * @default 0
   */
  effectRange?: number;

  /**
   * Duration of the effect in seconds
   * @default 0
   */
  effectTime?: number;

  /**
   * Filter to determine which entities are affected
   */
  entityFilter?: EntityFilters;
}
