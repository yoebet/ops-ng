import { ExSymbolBase } from '@/models/strategy/ex-symbol-base';
import { ExTradeType } from '@/models/ex/exchange-types';
import { OrderStatus, OrderTag } from '@/models/orders';
import { TradeSide } from '@/models/base';


export class ExOrder extends ExSymbolBase {
  // userId: number;

  userExAccountId: number;

  strategyId?: number;

  dealId?: number;

  tag?: OrderTag;

  side: TradeSide;

  tradeType?: ExTradeType;

  timeType?: 'gtc' | 'fok' | 'ioc';

  status: OrderStatus;

  clientOrderId?: string;

  priceType: 'market' | 'limit';

  limitPrice?: number;

  baseSize?: number;

  quoteAmount?: number;

  reduceOnly?: boolean;

  algoOrder: boolean;

  tpslType?: 'tp' | 'sl' | 'tpsl' | 'move';

  tpslClientOrderId?: string;

  tpTriggerPrice?: number;

  tpOrderPrice?: number; // 委托价格为-1时，执行市价止盈

  slTriggerPrice?: number;

  slOrderPrice?: number; // 委托价格为-1时，执行市价止损

  moveDrawbackPercent?: number;

  moveActivePrice?: number;

  // ---

  paperTrade?: boolean;

  exOrderId?: string;

  execPrice?: number;

  execSize?: number;

  execAmount?: number;

  exCreatedAt?: string;

  exUpdatedAt?: string;

  rawOrderParams?: any;

  rawOrder?: any;

  memo?: string;
}


