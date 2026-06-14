import { BehaviorPriority } from './behavior-priority';

export interface GuardianAttackBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;

  /**
   * The amount of additional damage dealt from an elder guardian's magic attack
   */
  elderExtraMagicDamage?: number;

  /**
   * The amount of additional damage dealt from a guardian's magic attack in hard difficulty
   */
  hardModeExtraMagicDamage?: number;

  /**
   * The amount of damage dealt from a guardian's magic attack
   */
  magicDamage?: number;

  /**
   * The minimum distance at which a guardian can use its magic attack
   */
  minDistance?: number;

  /**
   * The delay time between the guardian's magic attack sound and the actual attack
   */
  soundDelayTime?: number;

  /**
   * The maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target
   */
  xMaxRotation?: number;

  /**
   * The maximum rotation (in degrees), on the Y-axis, this entity can rotate its head while trying to look at the target
   */
  yMaxHeadRotation?: number;
}
