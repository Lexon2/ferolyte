import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SchedulerComponent } from '../../../interfaces/components/timers-and-schedulers/scheduler-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a SchedulerComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSchedulerComponent = (
  component: Partial<SchedulerComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:scheduler': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate minDelaySecs
  if (component.minDelaySecs !== undefined) {
    if (!validateNumber(component.minDelaySecs, 'minDelaySecs', 0)) {
      return undefined;
    }
    result.min_delay_secs = component.minDelaySecs;
  }

  // Validate maxDelaySecs
  if (component.maxDelaySecs !== undefined) {
    if (!validateNumber(component.maxDelaySecs, 'maxDelaySecs', 0)) {
      return undefined;
    }
    result.max_delay_secs = component.maxDelaySecs;
  }

  // Validate scheduledEvents
  if (component.scheduledEvents !== undefined) {
    if (!Array.isArray(component.scheduledEvents)) {
      console.error('scheduledEvents must be an array');

      return undefined;
    }

    result.scheduled_events = component.scheduledEvents.map((event, index) => {
      if (typeof event !== 'object' || event === null) {
        console.error(`scheduledEvents[${index}] must be an object`);

        return undefined;
      }

      // Validate event
      const convertedEvent = convertTrigger(
        event.event,
        withFieldPath(ctx, 'event'),
      );
      if (!convertedEvent) {
        return undefined;
      }

      return convertedEvent;
    });

    if (result.scheduled_events.some((event: any) => event === undefined)) {
      return undefined;
    }
  }

  return {
    'minecraft:scheduler': result,
  };
};
