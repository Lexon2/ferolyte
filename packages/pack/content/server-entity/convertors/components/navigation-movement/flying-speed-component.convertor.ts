import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FlyingSpeedComponent } from '../../../interfaces/components/navigation-movement/flying-speed-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a FlyingSpeedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFlyingSpeedComponent = (
  component: Partial<FlyingSpeedComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:flying_speed': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate value
  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:flying_speed': result,
  };
};
