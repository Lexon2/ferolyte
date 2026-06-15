import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  ApplyKnockbackRulesComponent,
  ApplyKnockbackRulesPreset,
} from '../../../interfaces/components/combat/apply-knockback-rules-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { validateBoolean, validateNumber } from '../../common/validation';

const convertPreset = (
  preset: ApplyKnockbackRulesPreset,
  fieldName: string,
  ctx?: ContentDiagnosticContext,
): Record<string, unknown> | undefined => {
  const result: Record<string, unknown> = {};

  if (preset.horizontalPower !== undefined) {
    if (
      !validateNumber(
        preset.horizontalPower,
        `${fieldName}.horizontalPower`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.horizontal_power = preset.horizontalPower;
  }

  if (preset.verticalPower !== undefined) {
    if (
      !validateNumber(
        preset.verticalPower,
        `${fieldName}.verticalPower`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.vertical_power = preset.verticalPower;
  }

  if (preset.verticalVelocityCap !== undefined) {
    if (
      !validateNumber(
        preset.verticalVelocityCap,
        `${fieldName}.verticalVelocityCap`,
        0.4,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.vertical_velocity_cap = preset.verticalVelocityCap;
  }

  if (preset.checkIfTargetIsImmersedInWater !== undefined) {
    if (
      !validateBoolean(
        preset.checkIfTargetIsImmersedInWater,
        `${fieldName}.checkIfTargetIsImmersedInWater`,
        ctx,
      )
    ) {
      return undefined;
    }
    result.check_if_target_is_immersed_in_water =
      preset.checkIfTargetIsImmersedInWater;
  }

  if (preset.filter !== undefined) {
    const convertedFilter = convertEntityFilters(
      preset.filter,
      withFieldPath(ctx, 'filter'),
    );
    if (!convertedFilter) {
      return undefined;
    }
    result.filter = convertedFilter;
  }

  if (preset.scalePreviousVelocity !== undefined) {
    if (
      !validateNumber(
        preset.scalePreviousVelocity,
        `${fieldName}.scalePreviousVelocity`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.scale_previous_velocity = preset.scalePreviousVelocity;
  }

  if (preset.horizontalHitAngleScale !== undefined) {
    if (
      !validateNumber(
        preset.horizontalHitAngleScale,
        `${fieldName}.horizontalHitAngleScale`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.horizontal_hit_angle_scale = preset.horizontalHitAngleScale;
  }

  if (preset.verticalHitAngleScale !== undefined) {
    if (
      !validateNumber(
        preset.verticalHitAngleScale,
        `${fieldName}.verticalHitAngleScale`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.vertical_hit_angle_scale = preset.verticalHitAngleScale;
  }

  if (preset.verticalPositionAngleScale !== undefined) {
    if (
      !validateNumber(
        preset.verticalPositionAngleScale,
        `${fieldName}.verticalPositionAngleScale`,
        undefined,
        undefined,
        ctx,
      )
    ) {
      return undefined;
    }
    result.vertical_position_angle_scale = preset.verticalPositionAngleScale;
  }

  if (preset.scaleWithDamage !== undefined) {
    if (
      !validateBoolean(
        preset.scaleWithDamage,
        `${fieldName}.scaleWithDamage`,
        ctx,
      )
    ) {
      return undefined;
    }
    result.scale_with_damage = preset.scaleWithDamage;
  }

  return result;
};

/**
 * Converts an ApplyKnockbackRulesComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertApplyKnockbackRulesComponent = (
  component: Partial<ApplyKnockbackRulesComponent>,
  ctx?: ContentDiagnosticContext,
):
  | { 'minecraft:apply_knockback_rules': Record<string, unknown> }
  | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.presets !== undefined) {
    const presets = component.presets.map((preset, index) =>
      convertPreset(preset, `presets[${index}]`, ctx),
    );

    if (presets.some((preset) => preset === undefined)) {
      return undefined;
    }

    result.presets = presets;
  }

  return {
    'minecraft:apply_knockback_rules': result,
  };
};
