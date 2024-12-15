import { ExSymbolBase } from '@/models/strategy/ex-symbol-base';
import { ExTradeType } from '@/models/ex/exchange-types';

export enum OrderTag {
  open = 'open',
  close = 'close',
  stoploss = 'stoploss',
  forceclose = 'forceclose',
}

export enum OrderStatus {
  notSummited = 'notSummited',
  summitFailed = 'summitFailed',
  pending = 'pending',
  partialFilled = 'partialFilled',
  filled = 'filled',
  canceled = 'canceled',
  expired = 'expired',
  rejected = 'rejected',
}

export class ExOrder extends ExSymbolBase {
  // userId: number;

  userExAccountId: number;

  strategyId?: number;

  dealId?: number;

  tag?: OrderTag;

  side: 'buy' | 'sell';

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

  exCreatedAt?: Date;

  exUpdatedAt?: Date;

  rawOrderParams?: any;

  rawOrder?: any;

  memo?: string;

  static orderFinished(status: OrderStatus): boolean {
    return ![
      OrderStatus.notSummited,
      OrderStatus.pending,
      OrderStatus.partialFilled,
    ].includes(status);
  }

  static orderToWait(status: OrderStatus): boolean {
    return [OrderStatus.pending, OrderStatus.partialFilled].includes(status);
  }
}
