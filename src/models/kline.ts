export interface Kline {
  time: string;
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
  // tds?: number;
  p_ch?: number;
  p_avg?: number;
  p_cp?: number;
  p_ap?: number;
}
