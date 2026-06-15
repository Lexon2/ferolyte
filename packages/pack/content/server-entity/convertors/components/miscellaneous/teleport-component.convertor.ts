import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { TeleportComponent } from '../../../interfaces/components/miscellaneous/teleport-component';
import { validateBoolean, validateNumber } from '../../common/validation';

/**
 * Converts a TeleportComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTeleportComponent = (
  component: TeleportComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:teleport': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.darkTeleportChance !== undefined) {
    if (!validateNumber(component.darkTeleportChance, 'darkTeleportChance')) {
      return undefined;
    }
    result.dark_teleport_chance = component.darkTeleportChance;
  }

  if (component.lightTeleportChance !== undefined) {
    if (!validateNumber(component.lightTeleportChance, 'lightTeleportChance')) {
      return undefined;
    }
    result.light_teleport_chance = component.lightTeleportChance;
  }

  if (component.maxRandomTeleportTime !== undefined) {
    if (
      !validateNumber(component.maxRandomTeleportTime, 'maxRandomTeleportTime')
    ) {
      return undefined;
    }
    result.max_random_teleport_time = component.maxRandomTeleportTime;
  }

  if (component.minRandomTeleportTime !== undefined) {
    if (
      !validateNumber(component.minRandomTeleportTime, 'minRandomTeleportTime')
    ) {
      return undefined;
    }
    result.min_random_teleport_time = component.minRandomTeleportTime;
  }

  if (component.randomTeleportCube !== undefined) {
    if (
      component.randomTeleportCube.length !== 3 ||
      !component.randomTeleportCube.every((value) =>
        validateNumber(value, 'randomTeleportCube'),
      )
    ) {
      return undefined;
    }
    result.random_teleport_cube = component.randomTeleportCube;
  }

  if (component.randomTeleports !== undefined) {
    if (!validateBoolean(component.randomTeleports, 'randomTeleports')) {
      return undefined;
    }
    result.random_teleports = component.randomTeleports;
  }

  if (component.targetDistance !== undefined) {
    if (!validateNumber(component.targetDistance, 'targetDistance')) {
      return undefined;
    }
    result.target_distance = component.targetDistance;
  }

  if (component.targetTeleportChance !== undefined) {
    if (
      !validateNumber(component.targetTeleportChance, 'targetTeleportChance')
    ) {
      return undefined;
    }
    result.target_teleport_chance = component.targetTeleportChance;
  }

  return {
    'minecraft:teleport': result,
  };
};
