import { LeashableComponent } from '../interfaces/block-config';

/**
 * Creates a leashable component for Minecraft blocks
 */
export const createLeashable = (
  options?: LeashableComponent,
): { 'minecraft:leashable': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (options.offset !== undefined) {
    if (
      !Array.isArray(options.offset) ||
      options.offset.length !== 3 ||
      !options.offset.every((val) => typeof val === 'number')
    ) {
      console.error('Offset must be a Vector3 array with 3 numeric values');

      return undefined;
    }
    result.offset = options.offset;
  }

  return {
    'minecraft:leashable': result,
  };
};
