import { Strategy } from '@/models/strategy/strategy';

export class BacktestStrategy extends Strategy {
  // 2024-10-30
  dataFrom: string;

  dataTo: string;

  startedAt?: string;

  completedAt?: string;
}
