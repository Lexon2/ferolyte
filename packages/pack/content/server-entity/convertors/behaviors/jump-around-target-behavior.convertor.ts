import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { JumpAroundTargetBehavior } from '../../interfaces/behaviors/jump-around-target-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateBoolean, validateDegrees, validateInteger, validateNumber, validateNumberArray, validateVector2 } from '../common/validation';

/**
 * Converts a JumpAroundTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertJumpAroundTargetBehavior = (
  behavior: Partial<JumpAroundTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.jump_around_target': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate checkCollision
  if (behavior.checkCollision !== undefined) {
    if (!validateBoolean(behavior.checkCollision, 'checkCollision')) {
      return undefined;
    }
    result.check_collision = behavior.checkCollision;
  }

  // Validate entityBoundingBoxScale
  if (behavior.entityBoundingBoxScale !== undefined) {
    if (!validateNumber(behavior.entityBoundingBoxScale, 'entityBoundingBoxScale')) {
      return undefined;
    }
    result.entity_bounding_box_scale = behavior.entityBoundingBoxScale;
  }

  // Validate jumpAngles
  if (behavior.jumpAngles !== undefined) {
    if (!validateNumberArray(behavior.jumpAngles, 'jumpAngles')) {
      return undefined;
    }
    result.jump_angles = behavior.jumpAngles;
  }

  // Validate jumpCooldownDuration
  if (behavior.jumpCooldownDuration !== undefined) {
    if (!validateNumber(behavior.jumpCooldownDuration, 'jumpCooldownDuration')) {
      return undefined;
    }
    result.jump_cooldown_duration = behavior.jumpCooldownDuration;
  }

  // Validate jumpCooldownWhenHurtDuration
  if (behavior.jumpCooldownWhenHurtDuration !== undefined) {
    if (!validateNumber(behavior.jumpCooldownWhenHurtDuration, 'jumpCooldownWhenHurtDuration')) {
      return undefined;
    }
    result.jump_cooldown_when_hurt_duration = behavior.jumpCooldownWhenHurtDuration;
  }

  // Validate landingDistanceFromTarget
  if (behavior.landingDistanceFromTarget !== undefined) {
    if (!validateVector2(behavior.landingDistanceFromTarget, 'landingDistanceFromTarget')) {
      return undefined;
    }
    result.landing_distance_from_target = behavior.landingDistanceFromTarget;
  }

  // Validate landingPositionSpreadDegrees
  if (behavior.landingPositionSpreadDegrees !== undefined) {
    if (!validateDegrees(behavior.landingPositionSpreadDegrees, 'landingPositionSpreadDegrees')) {
      return undefined;
    }
    result.landing_position_spread_degrees = behavior.landingPositionSpreadDegrees;
  }

  // Validate lastHurtDuration
  if (behavior.lastHurtDuration !== undefined) {
    if (!validateNumber(behavior.lastHurtDuration, 'lastHurtDuration')) {
      return undefined;
    }
    result.last_hurt_duration = behavior.lastHurtDuration;
  }

  // Validate lineOfSightObstructionHeightIgnore
  if (behavior.lineOfSightObstructionHeightIgnore !== undefined) {
    if (!validateInteger(behavior.lineOfSightObstructionHeightIgnore, 'lineOfSightObstructionHeightIgnore')) {
      return undefined;
    }
    result.line_of_sight_obstruction_height_ignore = behavior.lineOfSightObstructionHeightIgnore;
  }

  // Validate maxJumpVelocity
  if (behavior.maxJumpVelocity !== undefined) {
    if (!validateNumber(behavior.maxJumpVelocity, 'maxJumpVelocity')) {
      return undefined;
    }
    result.max_jump_velocity = behavior.maxJumpVelocity;
  }

  // Validate prepareJumpDuration
  if (behavior.prepareJumpDuration !== undefined) {
    if (!validateNumber(behavior.prepareJumpDuration, 'prepareJumpDuration')) {
      return undefined;
    }
    result.prepare_jump_duration = behavior.prepareJumpDuration;
  }

  // Validate requiredVerticalSpace
  if (behavior.requiredVerticalSpace !== undefined) {
    if (!validateInteger(behavior.requiredVerticalSpace, 'requiredVerticalSpace')) {
      return undefined;
    }
    result.required_vertical_space = behavior.requiredVerticalSpace;
  }

  // Validate snapToSurfaceBlockRange
  if (behavior.snapToSurfaceBlockRange !== undefined) {
    if (!validateNumber(behavior.snapToSurfaceBlockRange, 'snapToSurfaceBlockRange')) {
      return undefined;
    }
    result.snap_to_surface_block_range = behavior.snapToSurfaceBlockRange;
  }

  // Validate validDistanceToTarget
  if (behavior.validDistanceToTarget !== undefined) {
    if (!validateVector2(behavior.validDistanceToTarget, 'validDistanceToTarget')) {
      return undefined;
    }
    result.valid_distance_to_target = behavior.validDistanceToTarget;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.jump_around_target': result
  };
};
