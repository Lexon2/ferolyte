import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TradeInterestBehavior } from '../../interfaces/behaviors/trade-interest-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a TradeInterestBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTradeInterestBehavior = (
  behavior: Partial<TradeInterestBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.trade_interest': any } | undefined => {
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

  // Validate carriedItemSwitchTime
  if (behavior.carriedItemSwitchTime !== undefined) {
    if (!validateNumber(behavior.carriedItemSwitchTime, 'carriedItemSwitchTime')) {
      return undefined;
    }
    result.carried_item_switch_time = behavior.carriedItemSwitchTime;
  }

  // Validate cooldown
  if (behavior.cooldown !== undefined) {
    if (!validateNumber(behavior.cooldown, 'cooldown')) {
      return undefined;
    }
    result.cooldown = behavior.cooldown;
  }

  // Validate interestTime
  if (behavior.interestTime !== undefined) {
    if (!validateNumber(behavior.interestTime, 'interestTime')) {
      return undefined;
    }
    result.interest_time = behavior.interestTime;
  }

  // Validate removeItemTime
  if (behavior.removeItemTime !== undefined) {
    if (!validateNumber(behavior.removeItemTime, 'removeItemTime')) {
      return undefined;
    }
    result.remove_item_time = behavior.removeItemTime;
  }

  // Validate withinRadius
  if (behavior.withinRadius !== undefined) {
    if (!validateNumber(behavior.withinRadius, 'withinRadius')) {
      return undefined;
    }
    result.within_radius = behavior.withinRadius;
  }

  return {
    'minecraft:behavior.trade_interest': result
  };
};
