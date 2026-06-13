const validCauses = [
  'all',
  'anvil',
  'block_explosion',
  'campfire',
  'charging',
  'contact',
  'drowning',
  'entity_attack',
  'entity_explosion',
  'fall',
  'falling_block',
  'fire',
  'fire_tick',
  'fireworks',
  'fly_into_wall',
  'freezing',
  'lava',
  'lightning',
  'magic',
  'magma',
  'none',
  'override',
  'piston',
  'projectile',
  'ram_attack',
  'self_destruct',
  'sonic_boom',
  'soul_campfire',
  'stalactite',
  'stalagmite',
  'starve',
  'suffocation',
  'temperature',
  'thorns',
  'void',
  'wither',
];

interface DamageAbsorptionOptions {
  causes: string[];
}

/**
 * Creates a damage_absorption component for Minecraft items
 * @param options The damage absorption options
 * @returns The damage_absorption component in Minecraft format or undefined if validation fails
 */
export const createDamageAbsorption = (
  options?: DamageAbsorptionOptions,
): { 'minecraft:damage_absorption': any } | undefined => {
  if (!options) {
    return undefined;
  }

  if (
    !Array.isArray(options.causes) ||
    options.causes.length === 0
  ) {
    // @TODO: Add error handling
    console.error('Absorbable causes must be a non-empty array');

    return undefined;
  }

  // Validate all causes are strings
  for (const cause of options.causes) {
    if (typeof cause !== 'string' || cause.length === 0) {
      // @TODO: Add error handling
      console.error('Absorbable causes must be non-empty strings');

      return undefined;
    }
    if (!validCauses.includes(cause)) {
      console.error(`Invalid absorbable cause: ${cause}`);

      return undefined;
    }
  }

  return {
    'minecraft:damage_absorption': {
      absorbable_causes: [...options.causes],
    },
  };
};
