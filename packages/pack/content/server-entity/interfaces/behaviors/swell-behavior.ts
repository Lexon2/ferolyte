import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the creeper to swell up when a player is nearby. It can only be used by Creepers.
 */
export interface SwellBehavior extends BehaviorPriority {
  /**
   * This mob starts swelling when a target is at least this many blocks away
   * @default 10
   */
  startDistance?: number;

  /**
   * This mob stops swelling when a target has moved away at least this many blocks
   * @default 2
   */
  stopDistance?: number;
}
