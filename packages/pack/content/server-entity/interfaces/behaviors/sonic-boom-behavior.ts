import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';

/**
 * Plays the provided sounds and activates the `SONIC BOOM` actor flag during the specified duration
 */
export interface SonicBoomBehavior extends BehaviorPriority {
  /**
   * Movement speed multiplier of the mob when using this AI Goal
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Cooldown in seconds required after using this attack until the entity can use sonic boom again
   * @default 5.0
   */
  attackCooldown?: number;

  /**
   * Attack damage of the sonic boom
   * @default 30.0
   */
  attackDamage?: number;

  /**
   * Horizontal range (in blocks) at which the sonic boom can damage the target
   * @default 15.0
   */
  attackRangeHorizontal?: number;

  /**
   * Vertical range (in blocks) at which the sonic boom can damage the target
   * @default 20.0
   */
  attackRangeVertical?: number;

  /**
   * Sound event for the attack
   * @default ""
   */
  attackSound?: SoundEvent;

  /**
   * Sound event for the charge up
   * @default ""
   */
  chargeSound?: SoundEvent;

  /**
   * Goal duration in seconds
   * @default 3.0
   */
  duration?: number;

  /**
   * Duration in seconds until the attack sound is played
   * @default 1.7
   */
  durationUntilAttackSound?: number;

  /**
   * Height cap of the attack knockback's vertical delta
   * @default 0.0
   */
  knockbackHeightCap?: number;

  /**
   * Horizontal strength of the attack's knockback applied to the attack target
   * @default 0.0
   */
  knockbackHorizontalStrength?: number;

  /**
   * Vertical strength of the attack's knockback applied to the attack target
   * @default 0.0
   */
  knockbackVerticalStrength?: number;
}
