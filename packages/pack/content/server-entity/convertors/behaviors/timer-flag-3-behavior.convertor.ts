import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertTimerFlag1Behavior } from './timer-flag-1-behavior.convertor';
import { TimerFlag3Behavior } from '../../interfaces/behaviors/timer-flag-3-behavior';

/**
 * Converts a TimerFlag3Behavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTimerFlag3Behavior = (
  behavior: Partial<TimerFlag3Behavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.timer_flag_3': any } | undefined => {
  const converted = convertTimerFlag1Behavior(behavior);
  if (!converted) {
    return undefined;
  }

  return {
    'minecraft:behavior.timer_flag_3':
      converted['minecraft:behavior.timer_flag_1'],
  };
};
