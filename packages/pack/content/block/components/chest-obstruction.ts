import { ChestObstructionComponent } from '../interfaces/block-config';

/**
 * Creates a chest_obstruction component for Minecraft blocks
 */
export const createChestObstruction = (
  options?: ChestObstructionComponent,
): { 'minecraft:chest_obstruction': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.obstructionRule !== undefined) {
    const validRules = ['always', 'never', 'shape'];
    if (!validRules.includes(options.obstructionRule)) {
      console.error('Obstruction rule must be "always", "never", or "shape"');

      return undefined;
    }
    result.obstruction_rule = options.obstructionRule;
  }

  return {
    'minecraft:chest_obstruction': result,
  };
};
