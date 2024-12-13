import { TimeLevel } from './time-level';

export interface Kline {
  ts: number;
  time?: string;
  // time?: Date;
  size: number;
  amount: number;
  open: number;
  high: number;
  low: number;
  close: number;
  bs?: number;
  ba?: number;
  ss?: number;
  sa?: number;
  p_ch?: number;
  p_avg?: number;
  p_cp?: number;
  p_ap?: number;
  v_bp?: number;
}

export interface ES {
  ex: string;
  symbol: string;
}
