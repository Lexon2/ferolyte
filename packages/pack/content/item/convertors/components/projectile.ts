import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import {
  validateNonEmptyString,
  validateNonNegativeNumber,
} from '../../../../common/validation/content-validation';

interface ProjectileOptions {
  projectileEntity: string;
  minimumCriticalPower?: number;
}

/**
 * Creates a projectile component for Minecraft items
 * @param options The projectile options
 * @returns The projectile component in Minecraft format or undefined if validation fails
 */
export const createProjectile = (
  options?: ProjectileOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:projectile': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !validateNonEmptyString(
      options.projectileEntity,
      ctx,
      'Projectile entity must be a non-empty string',
      'projectileEntity',
    )
  ) {
    return undefined;
  }

  const result: any = {
    projectile_entity: options.projectileEntity,
  };

  if (options.minimumCriticalPower !== undefined) {
    if (
      !validateNonNegativeNumber(
        options.minimumCriticalPower,
        ctx,
        'Minimum critical power must be a non-negative number',
        'minimumCriticalPower',
      )
    ) {
      return undefined;
    }
    result.minimum_critical_power = options.minimumCriticalPower;
  }

  return {
    'minecraft:projectile': result,
  };
};
