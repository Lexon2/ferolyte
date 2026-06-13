import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { DashActionComponent } from '../../../interfaces/components/control/dash-action-component';
import {
  validateAllowedValues,
  validateBoolean,
  validateNumber,
} from '../../common/validation';

const DASH_DIRECTIONS = ['entity', 'passenger'] as const;

/**
 * Converts a DashActionComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertDashActionComponent = (
  component: Partial<DashActionComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:dash_action': Record<string, unknown> } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.canDashUnderwater !== undefined) {
    if (!validateBoolean(component.canDashUnderwater, 'canDashUnderwater', ctx)) {
      return undefined;
    }
    result.can_dash_underwater = component.canDashUnderwater;
  }

  if (component.cooldownTime !== undefined) {
    if (!validateNumber(component.cooldownTime, 'cooldownTime', 0, Number.MAX_VALUE, ctx)) {
      return undefined;
    }
    result.cooldown_time = component.cooldownTime;
  }

  if (component.horizontalMomentum !== undefined) {
    if (
      !validateNumber(
        component.horizontalMomentum,
        'horizontalMomentum',
        undefined,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.horizontal_momentum = component.horizontalMomentum;
  }

  if (component.verticalMomentum !== undefined) {
    if (
      !validateNumber(
        component.verticalMomentum,
        'verticalMomentum',
        undefined,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.vertical_momentum = component.verticalMomentum;
  }

  if (component.direction !== undefined) {
    if (!validateAllowedValues(component.direction, DASH_DIRECTIONS, 'direction', ctx)) {
      return undefined;
    }
    result.direction = component.direction;
  }

  return {
    'minecraft:dash_action': result,
  };
};
