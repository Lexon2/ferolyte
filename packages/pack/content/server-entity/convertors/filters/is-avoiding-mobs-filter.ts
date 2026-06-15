import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { IsAvoidingMobsFilter } from '../../interfaces/filters/is-avoiding-mobs-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an IsAvoidingMobsFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsAvoidingMobsFilter = (
  filter: Partial<IsAvoidingMobsFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertBooleanFilter(
    {
      ...filter,
      test: 'is_avoiding_mobs',
    },
    ctx,
  );
};
