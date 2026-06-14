import { convertBarterComponent } from './barter-component.convertor';
import { convertEconomyTradeTableComponent } from './economy-trade-table-component.convertor';
import { convertTradeResupplyComponent } from './trade-resupply-component';
import { convertTradeTableComponent } from './trade-table-component';

export const entityTradeComponentConvertorsFactory = {
  barter: convertBarterComponent,
  economyTradeTable: convertEconomyTradeTableComponent,
  tradeResupply: convertTradeResupplyComponent,
  tradeTable: convertTradeTableComponent
};
