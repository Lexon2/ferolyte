import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the mob to search for a random target and, if a direct path exists between the mob and the target, it will perform a charge.
 * If the attack hits, the target will be knocked back based on the mob's speed.
 */
export interface RamAttackBehavior extends BehaviorPriority {
  /**
   * The modifier to knockback that babies have
   * @default 0.333333
   */
  babyKnockbackModifier?: number;

  /**
   * Minimum and maximum cooldown time-range (positive, in seconds) between each attempted ram attack
   * @default [10, 20]
   */
  cooldownRange?: [number, number];

  /**
   * The force of the knockback of the ram attack
   * @default 5.0
   */
  knockbackForce?: number;

  /**
   * The height of the knockback of the ram attack
   * @default 0.1
   */
  knockbackHeight?: number;

  /**
   * The minimum distance at which the mob can start a ram attack
   * @default 4.0
   */
  minRamDistance?: number;

  /**
   * The event to trigger when attacking
   */
  onStart?: EntityEventTrigger;

  /**
   * The sound to play when an entity is about to perform a ram attack
   * @default ""
   */
  preRamSound?: SoundEvent;

  /**
   * The distance at which the mob start to run with ram speed
   * @default 7.0
   */
  ramDistance?: number;

  /**
   * The sound to play when an entity is impacting on a ram attack
   * @default ""
   */
  ramImpactSound?: SoundEvent;

  /**
   * Sets the entity's speed when charging toward the target
   * @default 2.0
   */
  ramSpeed?: number;

  /**
   * Sets the entity's speed when running toward the target
   * @default 1.0
   */
  runSpeed?: number;

  /**
   * The event to trigger when attacking
   */
  trigger?: EntityEventTrigger;
}
