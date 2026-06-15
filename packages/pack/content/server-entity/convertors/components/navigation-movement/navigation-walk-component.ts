import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBaseNavigation } from './base-navigation';
import { NavigationWalkComponent } from '../../../interfaces/components/navigation-movement/navigation-walk-component';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a NavigationWalkComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNavigationWalkComponent = (
  component: Partial<NavigationWalkComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:navigation.walk': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result = convertBaseNavigation(component);
  if (!result) {
    return undefined;
  }

  // Validate canFloat
  if (component.canFloat !== undefined) {
    if (!validateBoolean(component.canFloat, 'canFloat')) {
      return undefined;
    }
    result.can_float = component.canFloat;
  }

  return {
    'minecraft:navigation.walk': result,
  };
};
