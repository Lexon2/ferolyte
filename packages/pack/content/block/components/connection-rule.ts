import { ConnectionRuleComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@artifex/common/content/validation/content-validation';

const VALID_ACCEPTS = ['all', 'none', 'only_fences'] as const;
const VALID_DIRECTIONS = ['east', 'north', 'south', 'west'] as const;

/**
 * Creates a connection_rule component for Minecraft blocks
 */
export const createConnectionRule = (
  options?: ConnectionRuleComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:connection_rule': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.acceptsConnectionsFrom !== undefined) {
    if (
      !validateAllowedValue(
        options.acceptsConnectionsFrom,
        VALID_ACCEPTS,
        ctx,
        'Accepts connections from must be "all", "none", or "only_fences"',
        'acceptsConnectionsFrom',
      )
    ) {
      return undefined;
    }
    result.accepts_connections_from = options.acceptsConnectionsFrom;
  }

  if (Array.isArray(options.enabledDirections)) {
    for (let index = 0; index < options.enabledDirections.length; index++) {
      const direction = options.enabledDirections[index];
      if (
        !validateAllowedValue(
          direction,
          VALID_DIRECTIONS,
          ctx,
          'Enabled directions must be valid cardinal directions',
          `enabledDirections[${index}]`,
        )
      ) {
        return undefined;
      }
    }

    result.enabled_directions = options.enabledDirections;
  }

  return {
    'minecraft:connection_rule': result,
  };
};
