import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MovementComponent } from '../../../interfaces/components/attribute/movement-component';
import { convertAttributeComponent } from '../../common/attribute';

/**
 * Converts a MovementComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertMovementComponent = (
  component: Partial<MovementComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  return convertAttributeComponent(component, 'movement', 0);
};
