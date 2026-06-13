import {
  RandomOffsetAxis,
  RandomOffsetComponent,
} from '../interfaces/block-config';

const convertAxis = (axis?: RandomOffsetAxis): any | undefined => {
  if (axis === undefined) {
    return undefined;
  }

  const result: any = {};

  if (axis.range !== undefined) {
    const range: any = {};
    if (axis.range.min !== undefined) {
      if (typeof axis.range.min !== 'number') {
        console.error('Random offset range min must be a number');

        return undefined;
      }
      range.min = axis.range.min;
    }
    if (axis.range.max !== undefined) {
      if (typeof axis.range.max !== 'number') {
        console.error('Random offset range max must be a number');

        return undefined;
      }
      range.max = axis.range.max;
    }
    result.range = range;
  }

  if (axis.steps !== undefined) {
    if (typeof axis.steps !== 'number') {
      console.error('Random offset steps must be a number');

      return undefined;
    }
    result.steps = axis.steps;
  }

  return result;
};

/**
 * Creates a random_offset component for Minecraft blocks
 */
export const createRandomOffset = (
  options?: RandomOffsetComponent,
): { 'minecraft:random_offset': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  for (const axis of ['x', 'y', 'z'] as const) {
    const converted = convertAxis(options[axis]);
    if (converted === undefined && options[axis] !== undefined) {
      return undefined;
    }
    if (converted !== undefined) {
      result[axis] = converted;
    }
  }

  return {
    'minecraft:random_offset': result,
  };
};
