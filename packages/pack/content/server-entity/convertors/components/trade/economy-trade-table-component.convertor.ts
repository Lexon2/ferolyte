import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { EconomyTradeTableComponent } from '../../../interfaces/components/trade/economy-trade-table-component';
import { validateBoolean } from '../../common/validation';
import { validateNumber } from '../../common/validation';
import { validateTradeOrLootTablePath } from '../../common/validation';

/**
 * Validates if a value is a valid trade discount
 * @param value The value to validate
 * @param fieldName The name of the field being validated
 * @returns True if the value is valid, false otherwise
 */
export const validateTradeDiscount = (
  value: any,
  fieldName: string
): boolean => {
  if (!Array.isArray(value) || value.length !== 2) {
    console.error(`${fieldName} must be an array with two numbers`);

    return false;
  }

  const [low, high] = value;
  if (typeof low !== 'number' || typeof high !== 'number') {
    console.error(`${fieldName} must contain only numbers`);

    return false;
  }

  if (low > high) {
    console.error(`${fieldName} low value must be less than or equal to high value`);

    return false;
  }

  return true;
};

/**
 * Converts an EconomyTradeTableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertEconomyTradeTableComponent = (
  component: Partial<EconomyTradeTableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:economy_trade_table': any } | undefined => {
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

  // Validate curedDiscount
  if (component.curedDiscount !== undefined) {
    if (!validateTradeDiscount(component.curedDiscount, 'curedDiscount')) {
      return undefined;
    }
    result.cured_discount = component.curedDiscount;
  }

  // Validate displayName
  if (component.displayName !== undefined) {
    if (typeof component.displayName !== 'string') {
      console.error('displayName must be a string');

      return undefined;
    }
    result.display_name = component.displayName;
  }

  // Validate heroDemandDiscount
  if (component.heroDemandDiscount !== undefined) {
    if (!validateNumber(component.heroDemandDiscount, 'heroDemandDiscount', -Infinity, 0)) {
      return undefined;
    }
    result.hero_demand_discount = component.heroDemandDiscount;
  }

  // Validate maxCuredDiscount
  if (component.maxCuredDiscount !== undefined) {
    if (!validateTradeDiscount(component.maxCuredDiscount, 'maxCuredDiscount')) {
      return undefined;
    }
    result.max_cured_discount = component.maxCuredDiscount;
  }

  // Validate maxNearbyCuredDiscount
  if (component.maxNearbyCuredDiscount !== undefined) {
    if (!validateNumber(component.maxNearbyCuredDiscount, 'maxNearbyCuredDiscount', -Infinity, 0)) {
      return undefined;
    }
    result.max_nearby_cured_discount = component.maxNearbyCuredDiscount;
  }

  // Validate nearbyCuredDiscount
  if (component.nearbyCuredDiscount !== undefined) {
    if (!validateNumber(component.nearbyCuredDiscount, 'nearbyCuredDiscount', -Infinity, 0)) {
      return undefined;
    }
    result.nearby_cured_discount = component.nearbyCuredDiscount;
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

  // Validate showTradeScreen
  if (component.showTradeScreen !== undefined) {
    if (!validateBoolean(component.showTradeScreen, 'showTradeScreen')) {
      return undefined;
    }
    result.show_trade_screen = component.showTradeScreen;
  }

  // Validate table
  if (component.table !== undefined) {
    if (!validateTradeOrLootTablePath(component.table, 'table')) {
      return undefined;
    }
    result.table = component.table;
  }

  // Validate useLegacyPriceFormula
  if (component.useLegacyPriceFormula !== undefined) {
    if (!validateBoolean(component.useLegacyPriceFormula, 'useLegacyPriceFormula')) {
      return undefined;
    }
    result.use_legacy_price_formula = component.useLegacyPriceFormula;
  }

  return {
    'minecraft:economy_trade_table': result
  };
};
