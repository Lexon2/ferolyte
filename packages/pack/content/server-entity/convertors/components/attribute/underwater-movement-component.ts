import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { UnderwaterMovementComponent } from '../../../interfaces/components/attribute/underwater-movement-component';
import { convertAttributeComponent } from '../../common/attribute';

/**
 * Converts an UnderwaterMovementComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertUnderwaterMovementComponent = (
  component: Partial<UnderwaterMovementComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  return convertAttributeComponent(component, 'underwater_movement');
};
