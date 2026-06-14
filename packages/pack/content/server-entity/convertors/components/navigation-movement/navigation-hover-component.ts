import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertBaseNavigation } from './base-navigation';
import { NavigationHoverComponent } from '../../../interfaces/components/navigation-movement/navigation-hover-component';

/**
 * Converts a NavigationHoverComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNavigationHoverComponent = (
  component: Partial<NavigationHoverComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:navigation.hover': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result = convertBaseNavigation(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:navigation.hover': result
  };
};
