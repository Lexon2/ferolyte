import { BehaviorPriority } from './behavior-priority';
import { DamageSourceType } from '../../constants/damage-source-types';
import { EntityFilters } from '../filters';

/**
 * Allows the mob to play dead when attacked by other entities. When playing dead, other entities will not target this mob.
 */
export interface PlayDeadBehavior extends BehaviorPriority {
  /**
   * Whether the mob will receive the regeneration effect while playing dead
   * @default true
   */
  applyRegeneration?: boolean;

  /**
   * The amount of time the mob will remain playing dead (in seconds)
   * @default 1.0
   */
  duration?: number;

  /**
   * The list of other triggers that are required for the mob to activate play dead
   */
  filters?: EntityFilters;

  /**
   * The amount of health at which damage will cause the mob to play dead
   * @default 0
   */
  forceBelowHealth?: number;

  /**
   * The likelihood of this goal starting upon taking damage
   * @default 1.0
   */
  randomStartChance?: number;

  /**
   * The range of damage that may cause the goal to start depending on randomness
   */
  randomDamageRange?: [number, number];

  /**
   * The list of Entity Damage Sources that will cause this mob to play dead
   * @default ["all"]
   */
  damageSources?: DamageSourceType | DamageSourceType[];
}
