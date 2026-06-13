import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ScaleByAgeComponent } from '../../../interfaces/components/physical/scale-by-age-component';
import { validateNumberRange } from '../../common/validation';

/**
 * Converts a ScaleByAgeComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertScaleByAgeComponent = (
  component: Partial<ScaleByAgeComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:scale_by_age': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any= {
  };

  if (component.startScale !== undefined) {
    if (!validateNumberRange(component.startScale, 0, Number.MAX_VALUE, 'startScale')) {
      return undefined;
    }
    result.start_scale = component.startScale;
  }

  if (component.endScale !== undefined) {
    if (!validateNumberRange(component.endScale, 0, Number.MAX_VALUE, 'endScale')) {
      return undefined;
    }
    result.end_scale = component.endScale;
  }

  return {
    'minecraft:scale_by_age': result
  };
};
