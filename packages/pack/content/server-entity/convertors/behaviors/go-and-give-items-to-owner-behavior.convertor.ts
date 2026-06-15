import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { GoAndGiveItemsToOwnerBehavior } from '../../interfaces/behaviors/go-and-give-items-to-owner-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateSoundEvent } from '../common/validation';

/**
 * Converts a GoAndGiveItemsToOwnerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertGoAndGiveItemsToOwnerBehavior = (
  behavior: Partial<GoAndGiveItemsToOwnerBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.go_and_give_items_to_owner': any } | undefined => {
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

  // Validate onItemThrow
  if (behavior.onItemThrow !== undefined) {
    const convertedOnItemThrow = convertTrigger(
      behavior.onItemThrow,
      withFieldPath(ctx, 'onItemThrow'),
    );
    if (!convertedOnItemThrow) {
      return undefined;
    }
    result.on_item_throw = convertedOnItemThrow;
  }

  // Validate reachMobDistance
  if (behavior.reachMobDistance !== undefined) {
    if (!validateNumber(behavior.reachMobDistance, 'reachMobDistance')) {
      return undefined;
    }
    result.reach_mob_distance = behavior.reachMobDistance;
  }

  // Validate runSpeed
  if (behavior.runSpeed !== undefined) {
    if (!validateNumber(behavior.runSpeed, 'runSpeed')) {
      return undefined;
    }
    result.run_speed = behavior.runSpeed;
  }

  // Validate throwForce
  if (behavior.throwForce !== undefined) {
    if (!validateNumber(behavior.throwForce, 'throwForce')) {
      return undefined;
    }
    result.throw_force = behavior.throwForce;
  }

  // Validate throwSound
  if (behavior.throwSound !== undefined) {
    if (!validateSoundEvent(behavior.throwSound, 'throwSound')) {
      return undefined;
    }
    result.throw_sound = behavior.throwSound;
  }

  // Validate verticalThrowMul
  if (behavior.verticalThrowMul !== undefined) {
    if (!validateNumber(behavior.verticalThrowMul, 'verticalThrowMul')) {
      return undefined;
    }
    result.vertical_throw_mul = behavior.verticalThrowMul;
  }

  return {
    'minecraft:behavior.go_and_give_items_to_owner': result,
  };
};
