import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { BodyRotationBlockedComponent } from '../../../interfaces/components/physical/body-rotation-blocked-component';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a BodyRotationBlockedComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBodyRotationBlockedComponent = (
  component: Partial<BodyRotationBlockedComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:body_rotation_blocked': any } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:body_rotation_blocked': {},
    };
  }

  if (!validateBoolean(component.value, 'value')) {
    return undefined;
  }

  return {
    'minecraft:body_rotation_blocked': {},
  };
};
