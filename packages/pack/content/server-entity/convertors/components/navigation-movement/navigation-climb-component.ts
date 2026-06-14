import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertBaseNavigation } from './base-navigation';
import { NavigationClimbComponent } from '../../../interfaces/components/navigation-movement/navigation-climb-component';

/**
 * Converts a NavigationClimbComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNavigationClimbComponent = (
  component: Partial<NavigationClimbComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:navigation.climb': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result = convertBaseNavigation(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:navigation.climb': result
  };
};
