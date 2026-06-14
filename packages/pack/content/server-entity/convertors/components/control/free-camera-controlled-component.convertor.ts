import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FreeCameraControlledComponent } from '../../../interfaces/components/control/free-camera-controlled-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a FreeCameraControlledComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFreeCameraControlledComponent = (
  component: Partial<FreeCameraControlledComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:free_camera_controlled': Record<string, unknown> } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.backwardsMovementModifier !== undefined) {
    if (
      !validateNumber(
        component.backwardsMovementModifier,
        'backwardsMovementModifier',
        0,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.backwards_movement_modifier = component.backwardsMovementModifier;
  }

  if (component.strafeSpeedModifier !== undefined) {
    if (
      !validateNumber(
        component.strafeSpeedModifier,
        'strafeSpeedModifier',
        0,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.strafe_speed_modifier = component.strafeSpeedModifier;
  }

  return {
    'minecraft:free_camera_controlled': result,
  };
};
