import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { GroupSizeComponent } from '../../../interfaces/components/ai/group-size-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a GroupSizeComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertGroupSizeComponent = (
  component: Partial<GroupSizeComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:group_size': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate filters
  if (component.filters !== undefined) {
    const convertedFilters = convertEntityFilters(component.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate radius
  if (component.radius !== undefined) {
    if (!validateNumber(component.radius, 'radius', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.radius = component.radius;
  }

  return {
    'minecraft:group_size': result
  };
};
