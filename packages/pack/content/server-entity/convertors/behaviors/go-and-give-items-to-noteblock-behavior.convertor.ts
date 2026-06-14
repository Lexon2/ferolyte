import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { GoAndGiveItemsToNoteblockBehavior } from '../../interfaces/behaviors/go-and-give-items-to-noteblock-behavior';
import { convertTrigger } from '../common/trigger.convertor';
import { validateInteger, validateNumber, validateSoundEvent } from '../common/validation';

/**
 * Converts a GoAndGiveItemsToNoteblockBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertGoAndGiveItemsToNoteblockBehavior = (
  behavior: Partial<GoAndGiveItemsToNoteblockBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.go_and_give_items_to_noteblock': any } | undefined => {
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

  // Validate listenTime
  if (behavior.listenTime !== undefined) {
    if (!validateInteger(behavior.listenTime, 'listenTime', 0)) {
      return undefined;
    }
    result.listen_time = behavior.listenTime;
  }

  // Validate onItemThrow
  if (behavior.onItemThrow !== undefined) {
    const convertedOnItemThrow = convertTrigger(behavior.onItemThrow, withFieldPath(ctx, 'onItemThrow'));
    if (!convertedOnItemThrow) {
      return undefined;
    }
    result.on_item_throw = behavior.onItemThrow;
  }

  // Validate reachBlockDistance
  if (behavior.reachBlockDistance !== undefined) {
    if (!validateNumber(behavior.reachBlockDistance, 'reachBlockDistance')) {
      return undefined;
    }
    result.reach_block_distance = behavior.reachBlockDistance;
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
    'minecraft:behavior.go_and_give_items_to_noteblock': result
  };
};
