import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertFilterBase } from './common/convert-filter-base';
import { IsGameRuleFilter } from '../../interfaces/filters/is-game-rule-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts a IsGameRuleFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsGameRuleFilter = (
  filter: Partial<IsGameRuleFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate domain property
  if (!filter.domain) {
    return undefined;
  }

  const baseResult = convertFilterBase(filter, ctx);
  if (!baseResult) {
    return undefined;
  }

  const result: MinecraftJsonFilter = {
    ...baseResult,
    test: 'is_game_rule',
    domain: filter.domain,
  };

  if (filter.value !== undefined) {
    result.value = filter.value;
  }

  return result;
};
