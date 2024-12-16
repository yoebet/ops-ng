import { ExSymbolBase } from '@/models/strategy/ex-symbol-base';
import { ExTradeType } from '@/models/ex/exchange-types';

export class StrategyDeal extends ExSymbolBase {
  strategyId: number;

  // userId: number;

  userExAccountId: number;

  tradeType: ExTradeType;

  pendingOrderId?: number;

  lastOrderId?: number;

  pnlUsd?: number;

  status: 'open' | 'closed' | 'canceled';

  paperTrade?: boolean;

  closedAt?: string;
}
