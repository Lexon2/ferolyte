import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { TargetNearbySensorComponent } from '../../../interfaces/components/sensors/target-nearby-sensor-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateBoolean, validateNumber } from '../../common/validation';

/**
 * Converts a TargetNearbySensorComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertTargetNearbySensorComponent = (
  component: Partial<TargetNearbySensorComponent>,
  ctx?: ContentDiagnosticContext,
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, any> = {
    'minecraft:target_nearby_sensor': {},
  };

  if (component.mustSee !== undefined) {
    if (!validateBoolean(component.mustSee, 'must_see')) {
      return undefined;
    }
    result['minecraft:target_nearby_sensor'].must_see = component.mustSee;
  }

  if (component.insideRange !== undefined) {
    if (!validateNumber(component.insideRange, 'inside_range')) {
      return undefined;
    }
    result['minecraft:target_nearby_sensor'].inside_range =
      component.insideRange;
  }

  if (component.onInsideRange !== undefined) {
    const convertedOnInsideRange = convertTrigger(
      component.onInsideRange,
      withFieldPath(ctx, 'onInsideRange'),
    );
    if (!convertedOnInsideRange) {
      return undefined;
    }
    result['minecraft:target_nearby_sensor'].on_inside_range =
      convertedOnInsideRange;
  }

  if (component.onOutsideRange !== undefined) {
    const convertedOnOutsideRange = convertTrigger(
      component.onOutsideRange,
      withFieldPath(ctx, 'onOutsideRange'),
    );
    if (!convertedOnOutsideRange) {
      return undefined;
    }
    result['minecraft:target_nearby_sensor'].on_outside_range =
      convertedOnOutsideRange;
  }

  if (component.onVisionLostInsideRange !== undefined) {
    const convertedOnVisionLostInsideRange = convertTrigger(
      component.onVisionLostInsideRange,
      withFieldPath(ctx, 'onVisionLostInsideRange'),
    );
    if (!convertedOnVisionLostInsideRange) {
      return undefined;
    }
    result['minecraft:target_nearby_sensor'].on_vision_lost_inside_range =
      convertedOnVisionLostInsideRange;
  }

  if (component.outsideRange !== undefined) {
    if (!validateNumber(component.outsideRange, 'outside_range')) {
      return undefined;
    }
    result['minecraft:target_nearby_sensor'].outside_range =
      component.outsideRange;
  }

  return result;
};
