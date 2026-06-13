import { RedstoneConductivityComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { validateBooleanValue } from '../../../common/validation/content-validation';

/**
 * Creates a redstone_conductivity component for Minecraft blocks
 */
export const createRedstoneConductivity = (
  options?: RedstoneConductivityComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:redstone_conductivity': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.allowsWireToStepDown !== undefined) {
    if (
      !validateBooleanValue(
        options.allowsWireToStepDown,
        ctx,
        'Allows wire to step down must be a boolean',
        'allowsWireToStepDown',
      )
    ) {
      return undefined;
    }
    result.allows_wire_to_step_down = options.allowsWireToStepDown;
  }

  if (options.redstoneConductor !== undefined) {
    if (
      !validateBooleanValue(
        options.redstoneConductor,
        ctx,
        'Redstone conductor must be a boolean',
        'redstoneConductor',
      )
    ) {
      return undefined;
    }
    result.redstone_conductor = options.redstoneConductor;
  }

  return {
    'minecraft:redstone_conductivity': result,
  };
};
