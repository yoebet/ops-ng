import { Strategy } from '@/models/strategy/strategy';
import { StrategyOrder } from '@/models/strategy/strategy-order';

export class BacktestStrategy extends Strategy {
  // 2024-10-30
  dataFrom: string;

  dataTo: string;

  startedAt?: string;

  completedAt?: string;

  orders?: StrategyOrder[];
}
