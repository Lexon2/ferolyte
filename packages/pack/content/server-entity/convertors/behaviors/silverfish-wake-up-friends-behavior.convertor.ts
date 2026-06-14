import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { SilverfishWakeUpFriendsBehavior } from '../../interfaces/behaviors/silverfish-wake-up-friends-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a SilverfishWakeUpFriendsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertSilverfishWakeUpFriendsBehavior = (
  behavior: Partial<SilverfishWakeUpFriendsBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.silverfish_wake_up_friends': any } | undefined => {
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

  return {
    'minecraft:behavior.silverfish_wake_up_friends': result
  };
};
