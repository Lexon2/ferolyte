import { PrecipitationInteractionsComponent } from '../interfaces/block-config';

/**
 * Creates a precipitation_interactions component for Minecraft blocks
 */
export const createPrecipitationInteractions = (
  options?: PrecipitationInteractionsComponent,
): { 'minecraft:precipitation_interactions': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const validBehaviors = [
    'obstruct_rain',
    'obstruct_rain_accumulate_snow',
    'none',
    'snow_log_no_collision',
  ];

  if (!validBehaviors.includes(options.precipitationBehavior)) {
    console.error('Precipitation behavior must be a valid enum value');

    return undefined;
  }

  return {
    'minecraft:precipitation_interactions': {
      precipitation_behavior: options.precipitationBehavior,
    },
  };
};
