import { Kline } from '@/models/kline';
import * as _ from 'lodash';
import { StrategyOrder } from '@/models/strategy/strategy-order';
import { TimeLevel } from '@/models/time-level';

export interface OrdersAgg {
  count: number;
  avgPrice: number;
  size: number;
  amount: number;
  orders: StrategyOrder[];
  tooltipContent?: string;
}

export interface ChartKline extends Kline {
  i: number;
  up: 1 | -1;
  // ma5?: number;
  // ma10?: number;
  bbMa?: number;
  bbUpper?: number;
  bbLower?: number;
  buyOrdersAgg?: OrdersAgg;
  sellOrdersAgg?: OrdersAgg;
  dateStr?: string;
  dateStrLocal?: string;
  size_s?: string;
  amount_s?: string;
  p_cp_s?: string;
  p_ap_s?: string;
  v_bp_s?: string;
  open_s?: string;
  high_s?: string;
  low_s?: string;
  close_s?: string;
}

export interface BollingerBandOptions {
  n: number, // 20
  k: number // 2
}


export function calculateMA(data: ChartKline[], n: number) {
  let sum = 0;
  let lastKl0: ChartKline;
  for (let i = 0; i < data.length; i++) {
    const kl = data[i];
    const fromIndex = i - n + 1;
    sum += kl.p_avg;
    if (fromIndex < 0) {
      continue;
    }
    if (lastKl0) {
      sum -= lastKl0.p_avg;
    }
    kl[`ma${n}`] = sum / n;
    lastKl0 = data[fromIndex];
  }
}

export function evalBBand(
  klines: ChartKline[],
  k = 2,
) {
  const kl = klines[klines.length - 1];
  const prices = klines.filter((k) => k.size > 0).map((k) => k.amount / k.size);
  const ma = _.sum(prices) / prices.length;
  const sqs = prices.map((p) => Math.pow(p - ma, 2));
  const std = Math.sqrt(_.sum(sqs) / sqs.length);
  const kstd = std * k;
  kl.bbMa = ma;
  kl.bbLower = ma - kstd;
  kl.bbUpper = ma + kstd;
}

export function evalBBands(
  klines: ChartKline[],
  bbOptions: BollingerBandOptions,
) {
  const { n, k } = bbOptions;
  const len = klines.length - 1;
  for (let i = n - 1; i < len; i++) {
    const kls = klines.slice(i - n + 1, i);
    evalBBand(kls, k);
  }
}

export function transformKline(kls: Kline[],
                               mas?: number[],
                               bbOptions?: BollingerBandOptions,) {
  let ii = 0;
  const klines: ChartKline[] = kls
    .map((k: Kline) => {
      if (k.v_bp == null) {
        k.p_ch = k.close - k.open;
        k.p_avg = k.size > 0 ? k.amount / k.size : 0;
        k.p_cp = (k.p_ch / k.open) * 100.0;
        k.p_ap = (Math.abs(k.high - k.low) / k.open) * 100.0;
        k.v_bp = k.size > 0 ? (k.bs / k.size) * 100.0 : 0;
      }
      const kl = k as ChartKline;
      kl.i = ii;
      kl.up = kl.close >= kl.open ? 1 : -1;
      return kl;
    });

  if (mas) {
    for (const ma of mas) {
      calculateMA(klines, ma);
    }
  }

  if (bbOptions) {
    evalBBands(klines, bbOptions);
  }

  return klines;
}


export function setKlineOrders(kls: ChartKline[],
                               orders: StrategyOrder[],
                               timeLevel: TimeLevel) {
  // const { interval, intervalMs } = timeLevel;

  for (const o of orders) {
    if (!o.exUpdatedAt) {
      continue;
    }
    if (!o.ts) {
      o.ts = new Date(o.exUpdatedAt).getTime();
    }
    const ii = _.sortedIndexBy<{ ts: number }>(kls, o, 'ts')
    let kl = kls[ii];
    if (kl && kl.ts === o.ts) {
    } else {
      kl = kls[ii - 1];
    }
    if (!kl) {
      continue;
    }
    const prop = `${o.side}OrdersAgg`;
    let oa: OrdersAgg = kl[prop];
    if (!oa) {
      oa = {
        orders: []
      } as OrdersAgg;
      kl[prop] = oa;
    }
    oa.orders.push(o);
  }
  const evalOrdersAgg = (oa: OrdersAgg) => {
    if (!oa) {
      return;
    }
    const orders = oa.orders;
    oa.count = orders.length;
    oa.size = _.sumBy(orders, 'execSize');
    if (oa.size) {
      oa.amount = _.sumBy(orders, 'execAmount');
      oa.avgPrice = oa.amount / oa.size;
    }
  }
  for (const kl of kls) {
    evalOrdersAgg(kl.buyOrdersAgg);
    evalOrdersAgg(kl.sellOrdersAgg);
  }
}
