import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TradeResupplyComponent } from '../../../interfaces/components/trade/trade-resupply-component';

/**
 * Converts a TradeResupplyComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTradeResupplyComponent = (
  component: Partial<TradeResupplyComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:trade_resupply': any } | undefined => {
  if (!component) {
    return undefined;
  }

  return {
    'minecraft:trade_resupply': {}
  };
};
