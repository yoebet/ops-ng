import { BaseModel } from '@/models/base-model';
import { ConsiderSide, OppCheckerAlgo, StrategyAlgo } from '@/models/strategy.types';
import { ExTradeType } from '@/models/ex/exchange-types';

export class StrategyTemplate extends BaseModel {
  // userId

  name: string;

  code: StrategyAlgo;

  openAlgo?: OppCheckerAlgo;

  closeAlgo?: OppCheckerAlgo;

  openDealSide?: ConsiderSide;

  tradeType?: ExTradeType;

  quoteAmount?: number;

  params?: any;

  memo?: string;
}
