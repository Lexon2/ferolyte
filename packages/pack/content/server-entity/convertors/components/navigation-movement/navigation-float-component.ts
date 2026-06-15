import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBaseNavigation } from './base-navigation';
import { NavigationFloatComponent } from '../../../interfaces/components/navigation-movement/navigation-float-component';

/**
 * Converts a NavigationFloatComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNavigationFloatComponent = (
  component: Partial<NavigationFloatComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:navigation.float': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result = convertBaseNavigation(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:navigation.float': result,
  };
};
