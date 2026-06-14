import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TradeWithPlayerBehavior } from '../../interfaces/behaviors/trade-with-player-behavior';
import { convertEntityFilters } from '../common/filters.convertor';
import { validateNumber } from '../common/validation';

/**
 * Converts a TradeWithPlayerBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTradeWithPlayerBehavior = (
  behavior: Partial<TradeWithPlayerBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.trade_with_player': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate filters
  if (behavior.filters !== undefined) {
    const convertedFilters = convertEntityFilters(behavior.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  return {
    'minecraft:behavior.trade_with_player': result
  };
};
