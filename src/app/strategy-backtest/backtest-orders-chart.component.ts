import { Component } from '@angular/core';
import rawData from '../kline-chart/k1d.json'
import { Kline } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import { KlineChartBaseComponent } from '../kline-chart/kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ChartKline, transformKline } from '@/app/kline-chart/kline-chart-data';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';
import { StrategyOrder } from '@/models/strategy/strategy-order';


@Component({
  selector: 'strategy-backtest-orders-chart',
  standalone: false,
  templateUrl: './orders-chart.component.html',
  styleUrl: './orders-chart.component.css'
})
export class BacktestOrdersChartComponent extends KlineChartBaseComponent {
  protected override mas = [10];
  protected strategy: BacktestStrategy;
  protected orders: StrategyOrder[];

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected stService: BacktestStrategyService,
              protected activatedRoute: ActivatedRoute,
  ) {
    super(themeService, sessionService);

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const strategyId = params.get('id');
      stService.getById2(+strategyId).subscribe(st => {
        this.strategy = st;
        if (!st) {
          return;
        }
        stService.getOrders(+strategyId).subscribe(result => {
          this.orders = result.list;
        });
        const { dataFrom, dataTo } = st;
      });
    });
  }

  override async ngOnInit() {
    await super.ngOnInit();
  }

  updateData() {
    (rawData as any[]).forEach(k => k.ts = new Date(k.time).getTime());
    const klines = transformKline(rawData as any[] as Kline[],
      this.mas,
      this.bbOptions);
    this.chartData = {
      es: { ex: 'binance', symbol: 'ETH/USDT' },
      // priceDigits: 2,
      timeLevel: TimeLevel.TL1mTo1d.slice(-1)[0],
      klines,
    };

    this.updateChartData();
  }
}
