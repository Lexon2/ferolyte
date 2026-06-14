import {
  BarterComponent,
  EconomyTradeTableComponent,
  TradeResupplyComponent,
  TradeTableComponent
} from './trade';

export interface EntityTradeComponents {
  barter?: BarterComponent;
  economyTradeTable?: EconomyTradeTableComponent;
  tradeResupply?: TradeResupplyComponent;
  tradeTable?: TradeTableComponent;
}
