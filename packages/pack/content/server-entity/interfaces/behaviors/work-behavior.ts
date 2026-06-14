import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the NPC to use the POI.
 */
export interface WorkBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier
   */
  speedMultiplier?: number;

  /**
   * The amount of ticks the NPC will stay in their the work location
   * @default 0
   */
  activeTime?: number;

  /**
   * If true, this entity can work when their jobsite POI is being rained on
   * @default false
   */
  canWorkInRain?: boolean;

  /**
   * The amount of ticks the goal will be on cooldown before it can be used again
   * @default 0
   */
  goalCooldown?: number;

  /**
   * Event to run when the mob reaches their jobsite
   */
  onArrival?: EntityEventTrigger;

  /**
   * The max interval in which a sound will play
   * @default 0
   */
  soundDelayMax?: number;

  /**
   * The min interval in which a sound will play
   * @default 0
   */
  soundDelayMin?: number;

  /**
   * If "can_work_in_rain" is false, this is the maximum number of ticks left in the goal where rain will not interrupt the goal
   * @default -1
   */
  workInRainTolerance?: number;
}
