import { BaseModel } from '@/models/base-model';

export class ExSymbolBase extends BaseModel {
  ex: string;

  market: string;

  baseCoin: string;

  symbol: string;

  rawSymbol: string;
}
