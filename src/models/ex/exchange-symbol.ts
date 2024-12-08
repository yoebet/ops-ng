import { BaseModel } from '@/models/base-model';

export class ExchangeSymbol extends BaseModel {
  ex: string;

  market: string;

  symbol: string;

  rawSymbol: string;

  priceDigits?: number;

  baseSizeDigits?: number;

  exchangeInfo?: any;
}
