import { SupportComponent } from '../interfaces/block-config';

/**
 * Creates a support component for Minecraft blocks
 */
export const createSupport = (
  options?: SupportComponent,
): { 'minecraft:support': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const validShapes = ['fence', 'stair'];
  if (!validShapes.includes(options.shape)) {
    console.error('Support shape must be "fence" or "stair"');

    return undefined;
  }

  return {
    'minecraft:support': {
      shape: options.shape,
    },
  };
};
