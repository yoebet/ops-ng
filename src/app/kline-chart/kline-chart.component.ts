import { Component } from '@angular/core';
import rawData from './k1d.json'
import { Kline } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import * as _ from 'lodash';
import { ChartKline, KlineChartBaseComponent } from './kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';


@Component({
  selector: 'kline-chart',
  standalone: false,
  templateUrl: './kline-chart.component.html',
  styleUrl: './kline-chart.component.css'
})
export class KlineChartComponent extends KlineChartBaseComponent {
  protected override mas = [10];

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService) {
    super(themeService, sessionService);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    setTimeout(() => {
      this.updateData();
    }, 1000);
  }

  updateData() {
    (rawData as any[]).forEach(k => k.ts = new Date(k.time).getTime());
    const klines = this.transformKline(rawData as any[] as Kline[]);
    this.chartData = {
      es: { ex: 'binance', symbol: 'ETH/USDT' },
      // priceDigits: 2,
      timeLevel: TimeLevel.TL1mTo1d.slice(-1)[0],
      klines,
    };

    this.updateChartData();
  }

  protected calculateMA(data: ChartKline[], n: number) {
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

  protected evalBBand(
    klines: ChartKline[],
    stdTimes = 2,
  ) {
    const kl = klines[klines.length - 1];
    const prices = klines.filter((k) => k.size > 0).map((k) => k.amount / k.size);
    const ma = _.sum(prices) / prices.length;
    const sqs = prices.map((p) => Math.pow(p - ma, 2));
    const std = Math.sqrt(_.sum(sqs) / sqs.length);
    const kstd = std * stdTimes;
    kl.bbMa = ma;
    kl.bbLower = ma - kstd;
    kl.bbUpper = ma + kstd;
  }

  protected evalBBands(
    klines: ChartKline[],
  ) {
    const { n, times } = this.bollingerBandOptions;
    const len = klines.length - 1;
    for (let i = n - 1; i < len; i++) {
      const kls = klines.slice(i - n + 1, i);
      this.evalBBand(kls, times);
    }
  }

  protected transformKline(kls: Kline[]) {
    let ii = 0;
    const klines: ChartKline[] = kls
      .map((k: Kline) => {
        if (k.v_bp == null) {
          k.p_ch = k.close - k.open;
          k.p_avg = k.size > 0 ? k.amount / k.size : 0;
          k.p_cp = (k.p_ch / k.open) * 100.0;
          k.p_ap = (Math.abs(k.high - k.low) / k.low) * 100.0;
          k.v_bp = k.size > 0 ? (k.bs / k.size) * 100.0 : 0;
        }
        const kl = k as ChartKline;
        kl.i = ii;
        kl.up = kl.close >= kl.open ? 1 : -1;
        kl.buyOrder = Math.random() < 0.1 ? {} as any : undefined;
        kl.sellOrder = Math.random() < 0.1 ? {} as any : undefined;
        return kl;
      });

    for (const ma of this.mas) {
      this.calculateMA(klines, ma);
    }

    if (this.bollingerBandOptions) {
      this.evalBBands(klines);
    }

    return klines;
  }
}
