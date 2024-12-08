import { ES } from '@/models/base';

export interface Kline {
  ts: number;
  // time?: string;
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


export interface KlineParams extends ES {
  tsFrom?: number;
  tsTo?: number;
  dateFrom?: string; // yyyy-MM-dd or yyyy-MM-dd HH:mm
  dateTo?: string;
  interval: string;
  limit?: number;
}
