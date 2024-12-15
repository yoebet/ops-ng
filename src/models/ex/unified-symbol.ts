import { BaseModel } from '@/models/base-model';

export class UnifiedSymbol extends BaseModel {
  symbol: string;

  market: string;

  base: string;

  quote: string;

  settle?: string;
}
