export interface ES {
  ex: string;
  symbol: string;
}

export enum TradeSide {
  'buy' = 'buy',
  'sell' = 'sell',
}

export interface Option {
  value: string;
  label: string
}
