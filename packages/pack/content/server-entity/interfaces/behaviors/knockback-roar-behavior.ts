import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the mob to perform a damaging knockback that affects all nearby entities.
 */
export interface KnockbackRoarBehavior extends BehaviorPriority {
  /**
   * The delay after which the knockback occurs (in seconds)
   * @default 0.5
   */
  attackTime?: number;

  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownTime?: number;

  /**
   * The list of conditions another entity must meet to be a valid target to apply damage to
   */
  damageFilters?: EntityFilters;

  /**
   * The duration of the roar (in seconds)
   * @default 1
   */
  duration?: number;

  /**
   * The damage dealt by the knockback roar
   * @default 6
   */
  knockbackDamage?: number;

  /**
   * The strength of the knockback
   * @default 4
   */
  knockbackStrength?: number;

  /**
   * The list of conditions another entity must meet to be a valid target to apply knockback to
   */
  knockbackFilters?: EntityFilters;

  /**
   * The strength of the horizontal knockback
   * @default 4
   */
  knockbackHorizontalStrength?: number;

  /**
   * The radius (in blocks) of the knockback effect
   * @default 4
   */
  knockbackRange?: number;

  /**
   * The strength of the vertical knockback
   * @default 4
   */
  knockbackVerticalStrength?: number;

  /**
   * The maximum height for vertical knockback
   * @default 0.4
   */
  knockbackHeightCap?: number;

  /**
   * If true, this mob will chase after the target as long as it's a valid target
   * @default false
   */
  trackTarget?: boolean;

  /**
   * Event that is triggered when the roar ends
   */
  onRoarEnd?: EntityEventTrigger;
}
