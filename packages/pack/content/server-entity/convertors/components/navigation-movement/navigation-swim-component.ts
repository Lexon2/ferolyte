import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBaseNavigation } from './base-navigation';
import { NavigationSwimComponent } from '../../../interfaces/components/navigation-movement/navigation-swim-component';

/**
 * Converts a NavigationSwimComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNavigationSwimComponent = (
  component: Partial<NavigationSwimComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:navigation.swim': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result = convertBaseNavigation(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:navigation.swim': result,
  };
};
