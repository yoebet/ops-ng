import { ExSymbolBase } from '@/models/strategy/ex-symbol-base';
import { ExTradeType } from '@/models/ex/exchange-types';
import { BaseModel } from '@/models/base-model';

export class StrategyDealSimple extends BaseModel {
  pendingOrderId?: number;

  lastOrderId?: number;

  pnlUsd?: number;

  status: 'open' | 'closed' | 'canceled';

  openAt?: string;

  closedAt?: string;

  dealDuration?: string;
}
