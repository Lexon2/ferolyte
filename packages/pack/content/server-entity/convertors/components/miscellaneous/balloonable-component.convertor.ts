import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { BalloonableComponent } from '../../../interfaces/components/miscellaneous/balloonable-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a BalloonableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBalloonableComponent = (
  component: Partial<BalloonableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:balloonable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate softDistance
  if (component.softDistance !== undefined) {
    if (!validateNumber(component.softDistance, 'softDistance', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.soft_distance = component.softDistance;
  }

  // Validate maxDistance
  if (component.maxDistance !== undefined) {
    if (!validateNumber(component.maxDistance, 'maxDistance', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.max_distance = component.maxDistance;
  }

  // Validate onBalloon
  if (component.onBalloon !== undefined) {
    if (!validateString(component.onBalloon, 'onBalloon')) {
      return undefined;
    }
    result.on_balloon = component.onBalloon;
  }

  // Validate onUnballoon
  if (component.onUnballoon !== undefined) {
    if (!validateString(component.onUnballoon, 'onUnballoon')) {
      return undefined;
    }
    result.on_unballoon = component.onUnballoon;
  }

  // Validate mass
  if (component.mass !== undefined) {
    if (!validateNumber(component.mass, 'mass', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.mass = component.mass;
  }

  return {
    'minecraft:balloonable': result,
  };
};
