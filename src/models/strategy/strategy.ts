import {ExSymbolBase} from '@/models/strategy/ex-symbol-base';
import {ExTradeType} from '@/models/ex/exchange-types';
import {ConsiderSide, OppCheckerAlgo, StrategyAlgo} from '@/models/strategy.types';
import {StrategyOrder} from '@/models/strategy/strategy-order';
import {StrategyDealSimple} from '@/models/strategy/strategy-deal-simple';

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

  memo?: string;

  pnlUsd?: number;

  dealsCount?: number;

  ordersCount?: number;

  orders?: StrategyOrder[];

  deals?: StrategyDealSimple[];
}
