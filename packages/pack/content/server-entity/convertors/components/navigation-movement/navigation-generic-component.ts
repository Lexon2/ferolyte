import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertBaseNavigation } from './base-navigation';
import { NavigationGenericComponent } from '../../../interfaces/components/navigation-movement/navigation-generic-component';

/**
 * Converts a NavigationGenericComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNavigationGenericComponent = (
  component: Partial<NavigationGenericComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:navigation.generic': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result = convertBaseNavigation(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:navigation.generic': result
  };
};
