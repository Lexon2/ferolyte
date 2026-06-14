import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the NPC to use the composter POI to convert excess seeds into bone meal.
 */
export interface WorkComposterBehavior extends BehaviorPriority {
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
   * The maximum number of times the mob will interact with the composter.
   * @default 1
   */
  blockInteractionMax?: number;

  /**
   * If true, this entity can work when their jobsite POI is being rained on
   * @default false
   */
  canEmptyComposter?: boolean;

  /**
   * If true, this entity can add items to a composter given that it is not full.
   * @default true
   */
  canFillComposter?: boolean;

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
   * The maximum number of items which can be added to the composter per block interaction.
   * @default 20
   */
  itemsPerUseMax?: number;

  /**
   * Limits the amount of each compostable item the mob can use. Any amount held over this number will be composted if possible
   * @default 10
   */
  minItemCount?: number;

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
   * The maximum interval in which the mob will interact with the composter.
   * @default 200
   */
  useBlockMax?: number;

  /**
   * The minimum interval in which the mob will interact with the composter.
   * @default 100
   */
  useBlockMin?: number;

  /**
   * If "can_work_in_rain" is false, this is the maximum number of ticks left in the goal where rain will not interrupt the goal
   * @default -1
   */
  workInRainTolerance?: number;
}
