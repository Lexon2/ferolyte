import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';

import { convertTimerFlag1Behavior } from './timer-flag-1-behavior.convertor';
import { TimerFlag2Behavior } from '../../interfaces/behaviors/timer-flag-2-behavior';

/**
 * Converts a TimerFlag2Behavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTimerFlag2Behavior = (
  behavior: Partial<TimerFlag2Behavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.timer_flag_2': any } | undefined => {
  const converted = convertTimerFlag1Behavior(behavior);
  if (!converted) {
    return undefined;
  }

  return {
    'minecraft:behavior.timer_flag_2': converted['minecraft:behavior.timer_flag_1']
  };
};
