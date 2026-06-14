import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this entity to use a flame-breath attack. Note: This behavior can only be used by the ender_dragon entity type.
 */
export interface DragonFlamingBehavior extends BehaviorPriority {
  /**
   * Time (in seconds), after roar, to breath flame
   * @default 10
   */
  cooldownTime?: number;

  /**
   * Time (in seconds), after roar, to breath flame
   * @default 0.5
   */
  flameTime?: number;

  /**
   * Number of ground flame-breath attacks to use before flight-takeoff
   * @default 4
   */
  groundFlameCount?: number;

  /**
   * Time (in seconds) to roar, before breathing flame
   * @default 2
   */
  roarTime?: number;
}
