import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DefaultLookAngleComponent } from '../../../interfaces/components/miscellaneous/default-look-angle-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a DefaultLookAngleComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDefaultLookAngleComponent = (
  component: Partial<DefaultLookAngleComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:default_look_angle': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate value
  if (component.value !== undefined) {
    if (
      !validateNumber(
        component.value,
        'value',
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.value = component.value;
  }

  return {
    'minecraft:default_look_angle': result,
  };
};
