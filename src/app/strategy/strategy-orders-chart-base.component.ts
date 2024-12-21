import { Component } from '@angular/core';
import { Kline, KlineParams } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import { KlineChartBaseComponent } from '../kline-chart/kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ChartKline, setKlineOrders, transformKline } from '@/app/kline-chart/kline-chart-data';
import { KlineDataService } from '@/services/market-data/kline-data.service';
import { Strategy } from '@/models/strategy/strategy';
import { DateTime } from 'luxon';
import { StrategyService } from '@/services/strategy/strategy.service';
import { ExKlineDataService } from '@/services/market-data/ex-kline-data.service';


@Component({
  template: '',
})
export abstract class StrategyOrdersChartBaseComponent extends KlineChartBaseComponent {
  protected override mas = [10];
  protected strategy: Strategy;

  timeLevels = TimeLevel.TL1mTo1d;
  limits = [300, 1000, 3000];
  params: KlineParams = {
    ex: '',
    symbol: '',
    interval: '1d',
    limit: this.limits[0],
  };
  klineSources = ['ex', 'db']
  klineSource = 'ex';

  protected constructor(protected override themeService: ThemeService,
                        protected override sessionService: SessionService,
                        protected stService: StrategyService,
                        protected klineDataService: KlineDataService,
                        protected exKlineDataService: ExKlineDataService
  ) {
    super(themeService, sessionService);
  }

  protected setParams() {
    const st = this.strategy;
    if (!st) {
      return;
    }
    const { ex, symbol } = st;
    this.params.ex = ex;
    this.params.symbol = symbol;
    const dtFrom = DateTime.fromISO(this.strategy.createdAt);
    const dtTo = DateTime.now();

    this.params.dateFrom = dtFrom.minus({ day: 1 }).toISODate();

    const seconds = dtTo.diff(dtFrom, 'seconds').get('seconds');
    const minBars = 50;
    for (const tl of TimeLevel.TL1mTo1d.slice().reverse()) {
      if (seconds / tl.intervalSeconds >= minBars) {
        this.params.interval = tl.interval;
        break;
      }
    }
  }

  refresh() {
    if (!this.strategy) {
      return;
    }
    const params = this.params;
    if (!params) {
      return;
    }
    const timeLevel: TimeLevel = TimeLevel.TL1mTo1d.find(tl => tl.interval === params.interval);
    let obs = this.klineDataService.query(params);
    if (this.klineSource === 'ex') {
      obs = this.exKlineDataService.query(params);
    }
    obs.subscribe((kls: Kline[]) => {
      const klines: ChartKline[] = transformKline(kls,
        this.mas,
        this.bbOptions);
      if (this.strategy.orders) {
        setKlineOrders(klines, this.strategy.orders, timeLevel)
      }
      this.chartData = {
        es: { ex: params.ex, symbol: params.symbol },
        // priceDigits: 2,
        timeLevel,
        klines,
      };

      this.updateChartData();
    });
  }
}
