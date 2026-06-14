import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { KnockbackResistanceComponent } from '../../../interfaces/components/attribute/knockback-resistance-component';
import { convertAttributeComponent } from '../../common/attribute';

/**
 * Converts a KnockbackResistanceComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertKnockbackResistanceComponent = (
  component: Partial<KnockbackResistanceComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  return convertAttributeComponent(component, 'knockback_resistance', 0, 1);
};
