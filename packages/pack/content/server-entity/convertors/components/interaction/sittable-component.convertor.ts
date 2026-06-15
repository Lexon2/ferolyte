import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { SittableComponent } from '../../../interfaces/components/interaction/sittable-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts a SittableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSittableComponent = (
  component: Partial<SittableComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:sittable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate sitEvent
  if (component.sitEvent !== undefined) {
    const convertedSitEvent = convertTrigger(
      component.sitEvent,
      withFieldPath(ctx, 'sitEvent'),
    );
    if (!convertedSitEvent) {
      return undefined;
    }
    result.sit_event = convertedSitEvent;
  }

  // Validate standEvent
  if (component.standEvent !== undefined) {
    const convertedStandEvent = convertTrigger(
      component.standEvent,
      withFieldPath(ctx, 'standEvent'),
    );
    if (!convertedStandEvent) {
      return undefined;
    }
    result.stand_event = convertedStandEvent;
  }

  return {
    'minecraft:sittable': result,
  };
};
