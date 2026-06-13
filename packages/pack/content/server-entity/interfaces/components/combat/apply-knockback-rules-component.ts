import { EntityFilters } from '../../filters';

/**
 * Preset for apply_knockback_rules component
 */
export interface ApplyKnockbackRulesPreset {
  horizontalPower?: number;
  verticalPower?: number;
  verticalVelocityCap?: number;
  checkIfTargetIsImmersedInWater?: boolean;
  filter?: EntityFilters;
  scalePreviousVelocity?: number;
  horizontalHitAngleScale?: number;
  verticalHitAngleScale?: number;
  verticalPositionAngleScale?: number;
  scaleWithDamage?: boolean;
}

/**
 * Interface for the apply_knockback_rules component
 * Controls how an entity applies knockback to a target.
 */
export interface ApplyKnockbackRulesComponent {
  /**
   * Presets evaluated when applying knockback. The first matching preset is used.
   */
  presets?: ApplyKnockbackRulesPreset[];
}
