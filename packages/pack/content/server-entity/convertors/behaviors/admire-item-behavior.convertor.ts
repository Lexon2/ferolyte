import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AdmireItemBehavior } from '../../interfaces/behaviors/admire-item-behavior';
import { convertRange } from '../common/convertors';
import { convertTrigger } from '../common/trigger.convertor';
import { validateNumber, validateSoundEvent } from '../common/validation';

/**
 * Converts an AdmireItemBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertAdmireItemBehavior = (
  behavior: Partial<AdmireItemBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.admire_item': any } | undefined => {
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

  // Validate admireItemSound
  if (behavior.admireItemSound !== undefined) {
    if (!validateSoundEvent(behavior.admireItemSound, 'admireItemSound')) {
      return undefined;
    }
    result.admire_item_sound = behavior.admireItemSound;
  }

  // Validate soundInterval
  if (behavior.soundInterval !== undefined) {
    const convertedInterval = convertRange(behavior.soundInterval, 'soundInterval');
    if (!convertedInterval) {
      return undefined;
    }
    result.sound_interval = convertedInterval;
  }

  // Validate onAdmireItemStart
  if (behavior.onAdmireItemStart !== undefined) {
    const onAdmireItemStart = convertTrigger(behavior.onAdmireItemStart, withFieldPath(ctx, 'onAdmireItemStart'));
    if (!onAdmireItemStart) {
      return undefined;
    }
    result.on_admire_item_start = onAdmireItemStart;
  }

  // Validate onAdmireItemStop
  if (behavior.onAdmireItemStop !== undefined) {
    const onAdmireItemStop = convertTrigger(behavior.onAdmireItemStop, withFieldPath(ctx, 'onAdmireItemStop'));
    if (!onAdmireItemStop) {
      return undefined;
    }
    result.on_admire_item_stop = onAdmireItemStop;
  }

  return {
    'minecraft:behavior.admire_item': result
  };
};
