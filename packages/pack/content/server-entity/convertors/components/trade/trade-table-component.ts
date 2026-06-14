import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TradeTableComponent } from '../../../interfaces/components/trade/trade-table-component';
import { validateBoolean } from '../../common/validation';
import { validateTradeOrLootTablePath } from '../../common/validation';

/**
 * Converts a TradeTableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTradeTableComponent = (
  component: Partial<TradeTableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:trade_table': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate convertTradesEconomy
  if (component.convertTradesEconomy !== undefined) {
    if (!validateBoolean(component.convertTradesEconomy, 'convertTradesEconomy')) {
      return undefined;
    }
    result.convert_trades_economy = component.convertTradesEconomy;
  }

  // Validate displayName
  if (component.displayName !== undefined) {
    if (typeof component.displayName !== 'string') {
      console.error('displayName must be a string');

      return undefined;
    }
    result.display_name = component.displayName;
  }

  // Validate newScreen
  if (component.newScreen !== undefined) {
    if (!validateBoolean(component.newScreen, 'newScreen')) {
      return undefined;
    }
    result.new_screen = component.newScreen;
  }

  // Validate persistTrades
  if (component.persistTrades !== undefined) {
    if (!validateBoolean(component.persistTrades, 'persistTrades')) {
      return undefined;
    }
    result.persist_trades = component.persistTrades;
  }

  // Validate table
  if (component.table !== undefined) {
    if (!validateTradeOrLootTablePath(component.table, 'table')) {
      return undefined;
    }
    result.table = component.table;
  }

  return {
    'minecraft:trade_table': result
  };
};
