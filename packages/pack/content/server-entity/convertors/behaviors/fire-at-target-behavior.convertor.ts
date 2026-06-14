import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FireAtTargetBehavior } from '../../interfaces/behaviors/fire-at-target-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateInteger, validateNumber, validateString, validateVector3 } from '../common/validation';

/**
 * Converts a FireAtTargetBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertFireAtTargetBehavior = (
  behavior: Partial<FireAtTargetBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.fire_at_target': any } | undefined => {
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

  // Validate attackCooldown
  if (behavior.attackCooldown !== undefined) {
    if (!validateNumber(behavior.attackCooldown, 'attackCooldown')) {
      return undefined;
    }
    result.attack_cooldown = behavior.attackCooldown;
  }

  // Validate attackRange
  if (behavior.attackRange !== undefined) {
    if (!validateVector3(behavior.attackRange, 'attackRange')) {
      return undefined;
    }
    result.attack_range = behavior.attackRange;
  }

  // Validate ownerAnchor
  if (behavior.ownerAnchor !== undefined) {
    if (!validateInteger(behavior.ownerAnchor, 'ownerAnchor')) {
      return undefined;
    }
    result.owner_anchor = behavior.ownerAnchor;
  }

  // Validate ownerOffset
  if (behavior.ownerOffset !== undefined) {
    if (!validateVector3(behavior.ownerOffset, 'ownerOffset')) {
      return undefined;
    }
    result.owner_offset = behavior.ownerOffset;
  }

  // Validate targetAnchor
  if (behavior.targetAnchor !== undefined) {
    if (!validateInteger(behavior.targetAnchor, 'targetAnchor')) {
      return undefined;
    }
    result.target_anchor = behavior.targetAnchor;
  }

  // Validate targetOffset
  if (behavior.targetOffset !== undefined) {
    if (!validateVector3(behavior.targetOffset, 'targetOffset')) {
      return undefined;
    }
    result.target_offset = behavior.targetOffset;
  }

  // Validate postShootDelay
  if (behavior.postShootDelay !== undefined) {
    if (!validateNumber(behavior.postShootDelay, 'postShootDelay')) {
      return undefined;
    }
    result.post_shoot_delay = behavior.postShootDelay;
  }

  // Validate preShootDelay
  if (behavior.preShootDelay !== undefined) {
    if (!validateNumber(behavior.preShootDelay, 'preShootDelay')) {
      return undefined;
    }
    result.pre_shoot_delay = behavior.preShootDelay;
  }

  // Validate projectileDef
  if (behavior.projectileDef !== undefined) {
    if (!validateString(behavior.projectileDef, 'projectileDef')) {
      return undefined;
    }
    result.projectile_def = behavior.projectileDef;
  }

  // Validate rangedFov
  if (behavior.rangedFov !== undefined) {
    if (!validateNumber(behavior.rangedFov, 'rangedFov')) {
      return undefined;
    }
    result.ranged_fov = behavior.rangedFov;
  }

  // Validate maxHeadRotationX
  if (behavior.maxHeadRotationX !== undefined) {
    if (!validateNumber(behavior.maxHeadRotationX, 'maxHeadRotationX')) {
      return undefined;
    }
    result.max_head_rotation_x = behavior.maxHeadRotationX;
  }

  // Validate maxHeadRotationY
  if (behavior.maxHeadRotationY !== undefined) {
    if (!validateNumber(behavior.maxHeadRotationY, 'maxHeadRotationY')) {
      return undefined;
    }
    result.max_head_rotation_y = behavior.maxHeadRotationY;
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
    'minecraft:behavior.fire_at_target': result,
  };
};
