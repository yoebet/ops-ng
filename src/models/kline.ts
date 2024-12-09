export interface Kline {
  ts: number;
  s: number;
  a: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface FtKline extends Kline {
  bs?: number;
  ba?: number;
  ss?: number;
  sa?: number;
  tds?: number;
}
