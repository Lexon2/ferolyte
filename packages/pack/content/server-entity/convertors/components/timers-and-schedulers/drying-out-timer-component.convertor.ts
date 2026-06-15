import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DryingOutTimerComponent } from '../../../interfaces/components/timers-and-schedulers/drying-out-timer-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateTime } from '../../common/validation';

/**
 * Converts a DryingOutTimerComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDryingOutTimerComponent = (
  component: Partial<DryingOutTimerComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:drying_out_timer': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate totalTime
  if (component.totalTime !== undefined) {
    if (!validateTime(component.totalTime, 'totalTime')) {
      return undefined;
    }
    result.total_time = component.totalTime;
  }

  // Validate waterBottleRefillTime
  if (component.waterBottleRefillTime !== undefined) {
    if (
      !validateTime(component.waterBottleRefillTime, 'waterBottleRefillTime')
    ) {
      return undefined;
    }
    result.water_bottle_refill_time = component.waterBottleRefillTime;
  }

  // Validate driedOutEvent
  if (component.driedOutEvent !== undefined) {
    const convertedDriedOutEvent = convertTrigger(
      component.driedOutEvent,
      withFieldPath(ctx, 'driedOutEvent'),
    );
    if (!convertedDriedOutEvent) {
      return undefined;
    }
    result.dried_out_event = convertedDriedOutEvent;
  }

  // Validate recoverAfterDriedOutEvent
  if (component.recoverAfterDriedOutEvent !== undefined) {
    const convertedRecoverAfterDriedOutEvent = convertTrigger(
      component.recoverAfterDriedOutEvent,
    );
    if (!convertedRecoverAfterDriedOutEvent) {
      return undefined;
    }
    result.recover_after_dried_out_event = convertedRecoverAfterDriedOutEvent;
  }

  // Validate stoppedDryingOutEvent
  if (component.stoppedDryingOutEvent !== undefined) {
    const convertedStoppedDryingOutEvent = convertTrigger(
      component.stoppedDryingOutEvent,
    );
    if (!convertedStoppedDryingOutEvent) {
      return undefined;
    }
    result.stopped_drying_out_event = convertedStoppedDryingOutEvent;
  }

  return {
    'minecraft:drying_out_timer': result,
  };
};
