export type MutationStrategy = 'random' | 'sequential' | 'weighted' | 'conditional' | 'environmental' | 'time_based' | 'health_based' | 'damage_based' | 'experience_based' | 'item_based' | 'block_based' | 'biome_based' | 'weather_based' | 'light_based' | 'difficulty_based' | 'custom';

export const MUTATION_STRATEGIES: readonly MutationStrategy[] = [
  'random',
  'sequential',
  'weighted',
  'conditional',
  'environmental',
  'time_based',
  'health_based',
  'damage_based',
  'experience_based',
  'item_based',
  'block_based',
  'biome_based',
  'weather_based',
  'light_based',
  'difficulty_based',
  'custom'
] as const;
