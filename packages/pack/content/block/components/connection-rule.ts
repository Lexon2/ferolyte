import { ConnectionRuleComponent } from '../interfaces/block-config';

/**
 * Creates a connection_rule component for Minecraft blocks
 */
export const createConnectionRule = (
  options?: ConnectionRuleComponent,
): { 'minecraft:connection_rule': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.acceptsConnectionsFrom !== undefined) {
    const validValues = ['all', 'none', 'only_fences'];
    if (!validValues.includes(options.acceptsConnectionsFrom)) {
      console.error(
        'Accepts connections from must be "all", "none", or "only_fences"',
      );

      return undefined;
    }
    result.accepts_connections_from = options.acceptsConnectionsFrom;
  }

  if (Array.isArray(options.enabledDirections)) {
    const validDirections = ['east', 'north', 'south', 'west'];

    for (const direction of options.enabledDirections) {
      if (!validDirections.includes(direction)) {
        console.error('Enabled directions must be valid cardinal directions');

        return undefined;
      }
    }

    result.enabled_directions = options.enabledDirections;
  }

  return {
    'minecraft:connection_rule': result,
  };
};
