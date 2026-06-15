import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { DIFFICULTIES } from '../../constants/difficulties';
import { IsDifficultyFilter } from '../../interfaces/filters/is-difficulty-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsDifficultyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsDifficultyFilter = (
  filter: Partial<IsDifficultyFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues(
    {
      ...filter,
      test: 'is_difficulty',
    },
    DIFFICULTIES,
    ctx,
  );
};
