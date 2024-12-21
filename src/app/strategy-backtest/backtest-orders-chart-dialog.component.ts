import { Component, Inject } from '@angular/core';
import { Kline, KlineParams } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import { KlineChartBaseComponent } from '../kline-chart/kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ChartKline, setKlineOrders, transformKline } from '@/app/kline-chart/kline-chart-data';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';
import { KlineDataService } from '@/services/strategy/kline-data.service';
import { parseDateTimeUtc } from '@/app/common/utils';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  standalone: false,
  selector: 'strategy-backtest-orders-chart-dialog',
  templateUrl: './orders-chart-dialog.component.html',
})
export class BacktestOrdersChartDialogComponent extends KlineChartBaseComponent {
  timeLevels = TimeLevel.TL1mTo1d;
  params: KlineParams = {
    ex: '',
    symbol: '',
    interval: '1d',
    limit: 3000,
  };
  protected override mas = [10];
  protected strategy: BacktestStrategy;

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected stService: BacktestStrategyService,
              protected klineDataService: KlineDataService,
              @Inject(MAT_DIALOG_DATA) public data: BacktestStrategy,
  ) {
    super(themeService, sessionService);

    this.strategy = data;
    const { ex, symbol, dataFrom, dataTo } = this.strategy;
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

    if (this.strategy.orders) {
      stService.getOrders(this.strategy.id).subscribe(result => {
        this.strategy.orders = result.list;
      });
    } else {
      this.refresh();
    }
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
