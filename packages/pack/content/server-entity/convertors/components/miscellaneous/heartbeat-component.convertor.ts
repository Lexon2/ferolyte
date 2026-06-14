import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { HeartbeatComponent } from '../../../interfaces/components/miscellaneous/heartbeat-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a HeartbeatComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHeartbeatComponent = (
  component: Partial<HeartbeatComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:heartbeat': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate interval
  if (component.interval !== undefined) {
    if (!validateNumber(component.interval, 'interval', -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return undefined;
    }
    result.interval = component.interval;
  }

  // Validate soundEvent
  if (component.soundEvent !== undefined) {
    if (!validateString(component.soundEvent, 'soundEvent')) {
      return undefined;
    }
    result.sound_event = component.soundEvent;
  }

  return {
    'minecraft:heartbeat': result,
  };
};
