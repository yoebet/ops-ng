import { ExSymbolBase } from '@/models/strategy/ex-symbol-base';
import { ExTradeType } from '@/models/ex/exchange-types';
import { ConsiderSide, OppCheckerAlgo, StrategyAlgo } from '@/models/strategy/strategy.types';

export class Strategy extends ExSymbolBase {
  algoCode: StrategyAlgo;

  name: string;

  openAlgo?: OppCheckerAlgo;

  closeAlgo?: OppCheckerAlgo;

  openDealSide?: ConsiderSide;

  // userId: number;

  userExAccountId: number;

  tradeType: ExTradeType;

  currentDealId?: number;

  lastDealId?: number;

  baseSize?: number;

  quoteAmount?: number;

  active: boolean;

  params?: any;

  paperTrade?: boolean;

  jobSummited?: boolean;
}
