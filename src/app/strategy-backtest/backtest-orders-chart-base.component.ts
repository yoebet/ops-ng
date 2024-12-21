import { Component } from '@angular/core';
import { Kline, KlineParams } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import { KlineChartBaseComponent } from '../kline-chart/kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ChartKline, setKlineOrders, transformKline } from '@/app/kline-chart/kline-chart-data';
import { ActivatedRoute } from '@angular/router';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';
import { KlineDataService } from '@/services/strategy/kline-data.service';
import { parseDateTimeUtc } from '@/app/common/utils';


@Component({
  template: '',
})
export abstract class BacktestOrdersChartBaseComponent extends KlineChartBaseComponent {
  timeLevels = TimeLevel.TL1mTo1d;
  limits = [300, 1000, 3000];
  params: KlineParams = {
    ex: '',
    symbol: '',
    interval: '1d',
    limit: this.limits[0],
  };
  protected override mas = [10];
  protected strategy: BacktestStrategy;

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected stService: BacktestStrategyService,
              protected klineDataService: KlineDataService,
  ) {
    super(themeService, sessionService);
  }

  protected setParams() {
    const st = this.strategy;
    if (!st) {
      return;
    }
    const { ex, symbol, dataFrom, dataTo } = st;
    this.params.ex = ex;
    this.params.symbol = symbol;
    const dtFrom = parseDateTimeUtc(dataFrom);
    const dtTo = parseDateTimeUtc(dataTo).plus({ day: 1 });

    this.params.dateFrom = dtFrom.minus({ day: 1 }).toISODate();
    this.params.dateTo = dtTo.plus({ day: 1 }).toISODate();

    const seconds = dtTo.diff(dtFrom, 'seconds').get('seconds');
    const minBars = 50;
    for (const tl of TimeLevel.TL1mTo1d.slice().reverse()) {
      if (seconds / tl.intervalSeconds >= minBars) {
        this.params.interval = tl.interval;
        break;
      }
    }

    this.stService.getOrders(st.id).subscribe(result => {
      st.orders = result.list;
      this.refresh();
    });
  }

  refresh() {
    const params = this.params;
    if (!params) {
      return;
    }
    const timeLevel: TimeLevel = TimeLevel.TL1mTo1d.find(tl => tl.interval === params.interval);
    this.klineDataService.query(params).subscribe((kls: Kline[]) => {
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
