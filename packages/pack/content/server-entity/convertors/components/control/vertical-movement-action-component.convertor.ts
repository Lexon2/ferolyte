import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { VerticalMovementActionComponent } from '../../../interfaces/components/control/vertical-movement-action-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a VerticalMovementActionComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertVerticalMovementActionComponent = (
  component: Partial<VerticalMovementActionComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:vertical_movement_action': Record<string, unknown> } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.verticalVelocity !== undefined) {
    if (!validateNumber(component.verticalVelocity, 'verticalVelocity', undefined, undefined, ctx)) {
      return undefined;
    }
    result.vertical_velocity = component.verticalVelocity;
  }

  return {
    'minecraft:vertical_movement_action': result,
  };
};
