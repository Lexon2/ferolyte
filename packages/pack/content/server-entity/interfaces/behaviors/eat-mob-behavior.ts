import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';

/**
 * [EXPERIMENTAL BEHAVIOR] Allows the entity to eat a specified Mob.
 */
export interface EatMobBehavior extends BehaviorPriority {
  /**
   * Sets the time in seconds the eat animation should play for
   * @default 1000000
   */
  eatAnimationTime?: number;

  /**
   * Sets the sound that should play when eating a mob
   */
  eatMobSound?: SoundEvent;

  /**
   * The loot table for loot to be dropped when eating a mob
   */
  lootTable?: string;

  /**
   * Sets the force which the mob-to-be-eaten is pulled towards the eating mob
   * @default 1000000
   */
  pullInForce?: number;

  /**
   * Sets the desired distance to be reached before eating the mob
   * @default 1000000
   */
  reachMobDistance?: number;

  /**
   * Sets the entity's speed when running toward the target
   * @default 1000000
   */
  runSpeed?: number;
}
