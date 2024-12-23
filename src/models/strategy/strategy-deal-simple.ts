import { BaseModel } from '@/models/base-model';

export class StrategyDealSimple extends BaseModel {
  pendingOrderId?: number;

  lastOrderId?: number;

  pnlUsd?: number;

  status: 'open' | 'closed' | 'canceled';

  openAt?: string;

  closedAt?: string;

  dealDuration?: string;

  closeReason?: string;

  ordersCount?: number;
}
