interface CooldownOptions {
  category: string;
  duration: number;
  type?: 'use' | 'attack';
}

/**
 * Creates a cooldown component for Minecraft items
 * @param options The cooldown options
 * @returns The cooldown component in Minecraft format or undefined if validation fails
 */
export const createCooldown = (
  options?: CooldownOptions,
): { 'minecraft:cooldown': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (typeof options.category !== 'string' || options.category.length === 0) {
    // @TODO: Add error handling
    console.error('Cooldown category must be a non-empty string');

    return undefined;
  }

  if (typeof options.duration !== 'number' || options.duration <= 0) {
    // @TODO: Add error handling
    console.error('Cooldown duration must be a positive number');

    return undefined;
  }

  const result: Record<string, unknown> = {
    category: options.category,
    duration: options.duration,
  };

  if (options.type !== undefined) {
    if (options.type !== 'use' && options.type !== 'attack') {
      console.error('Cooldown type must be "use" or "attack"');

      return undefined;
    }
    result.type = options.type;
  }

  return {
    'minecraft:cooldown': result,
  };
};
