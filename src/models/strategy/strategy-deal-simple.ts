import {BaseModel} from '@/models/base-model';
import {TradeSide} from '@/models/base';

export class StrategyDealSimple extends BaseModel {
  pendingOrderId?: number;

  lastOrderId?: number;

  lastOrderSide?: TradeSide;

  pnlUsd?: number;

  status: 'open' | 'closed' | 'canceled';

  openAt?: string;

  closedAt?: string;

  dealDuration?: string;

  closeReason?: string;

  ordersCount?: number;
}
