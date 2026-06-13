import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { LavaMovementComponent } from '../../../interfaces/components/attribute/lava-movement-component';
import { convertAttributeComponent } from '../../common/attribute';

/**
 * Converts a LavaMovementComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertLavaMovementComponent = (
  component: Partial<LavaMovementComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  return convertAttributeComponent(component, 'lava_movement');
};
