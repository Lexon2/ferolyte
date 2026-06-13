import { PrecipitationInteractionsComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { validateAllowedValue } from '../../../common/validation/content-validation';

const VALID_BEHAVIORS = [
  'obstruct_rain',
  'obstruct_rain_accumulate_snow',
  'none',
  'snow_log_no_collision',
] as const;

/**
 * Creates a precipitation_interactions component for Minecraft blocks
 */
export const createPrecipitationInteractions = (
  options?: PrecipitationInteractionsComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:precipitation_interactions': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      options.precipitationBehavior,
      VALID_BEHAVIORS,
      ctx,
      'Precipitation behavior must be a valid enum value',
      'precipitationBehavior',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:precipitation_interactions': {
      precipitation_behavior: options.precipitationBehavior,
    },
  };
};
