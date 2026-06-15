import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ShooterComponent } from '../../../interfaces/components/combat/shooter-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a ShooterComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertShooterComponent = (
  component: Partial<ShooterComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:shooter': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate auxVal
  if (component.auxVal !== undefined) {
    if (
      !validateNumber(component.auxVal, 'auxVal', -1, Number.MAX_SAFE_INTEGER)
    ) {
      return undefined;
    }
    result.aux_val = component.auxVal;
  }

  // Validate def
  if (component.def !== undefined) {
    if (typeof component.def !== 'string') {
      console.error('def must be a string');

      return undefined;
    }
    result.def = component.def;
  }

  // Validate magic
  if (component.magic !== undefined) {
    if (typeof component.magic !== 'boolean') {
      console.error('magic must be a boolean');

      return undefined;
    }
    result.magic = component.magic;
  }

  // Validate power
  if (component.power !== undefined) {
    if (!validateNumber(component.power, 'power', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.power = component.power;
  }

  // Validate projectiles
  if (component.projectiles !== undefined) {
    if (!Array.isArray(component.projectiles)) {
      console.error('projectiles must be an array');

      return undefined;
    }

    const projectiles = component.projectiles.map((projectile, index) => {
      if (typeof projectile === 'string') {
        return projectile;
      }

      const projectileData: any = {};

      // Validate auxVal
      if (projectile.auxVal !== undefined) {
        if (
          !validateNumber(
            projectile.auxVal,
            `projectiles[${index}].auxVal`,
            -1,
            Number.MAX_SAFE_INTEGER,
          )
        ) {
          return undefined;
        }
        projectileData.aux_val = projectile.auxVal;
      }

      // Validate def
      if (projectile.def !== undefined) {
        if (typeof projectile.def !== 'string') {
          console.error(`projectiles[${index}].def must be a string`);

          return undefined;
        }
        projectileData.def = projectile.def;
      }

      // Validate filters
      if (projectile.filters !== undefined) {
        const convertedFilters = convertEntityFilters(
          projectile.filters,
          withFieldPath(ctx, `projectiles[${index}].filters`),
        );
        if (!convertedFilters) {
          return undefined;
        }
        projectileData.filters = convertedFilters;
      }

      return projectileData;
    });

    if (projectiles.includes(undefined)) {
      return undefined;
    }

    result.projectiles = projectiles;
  }

  // Validate sound
  if (component.sound !== undefined) {
    if (typeof component.sound !== 'string') {
      console.error('sound must be a string');

      return undefined;
    }
    result.sound = component.sound;
  }

  return {
    'minecraft:shooter': result,
  };
};
