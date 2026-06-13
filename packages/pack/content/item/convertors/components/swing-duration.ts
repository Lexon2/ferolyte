interface SwingDurationOptions {
  value?: number;
}

/**
 * Creates a swing_duration component for Minecraft items
 * @param options The swing duration options
 * @returns The swing_duration component in Minecraft format or undefined if validation fails
 */
export const createSwingDuration = (
  options?: SwingDurationOptions,
): { 'minecraft:swing_duration': { value: number } } | undefined => {
  if (!options || options.value === undefined) {
    return undefined;
  }

  if (typeof options.value !== 'number' || options.value < 0) {
    console.error('Swing duration value must be a non-negative number');

    return undefined;
  }

  return {
    'minecraft:swing_duration': {
      value: options.value,
    },
  };
};
