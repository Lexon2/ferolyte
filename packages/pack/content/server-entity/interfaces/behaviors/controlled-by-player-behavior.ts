import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the entity to be controlled by the player using an item in the item_controllable property
 * Also requires the minecraft:movement property, and the minecraft:rideable property
 * On every tick, the entity will attempt to rotate towards where the player is facing with the control item
 * whilst simultaneously moving forward
 */
export interface ControlledByPlayerBehavior extends BehaviorPriority {
  /**
   * The entity will attempt to rotate to face where the player is facing each tick
   * The entity will target this percentage of their difference in their current facing angles each tick
   * (from 0.0 to 1.0 where 1.0 = 100%). This is limited by FractionalRotationLimit
   * A value of 0.0 will result in the entity no longer turning to where the player is facing
   * @default 0.5
   */
  fractionalRotation?: number;

  /**
   * Limits the total degrees the entity can rotate to face where the player is facing on each tick
   * @default 5.0
   */
  fractionalRotationLimit?: number;

  /**
   * Speed multiplier of mount when controlled by player
   * @default 1.0
   */
  mountSpeedMultiplier?: number;
}
