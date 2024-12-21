import { Component } from '@angular/core';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { KlineDataService } from '@/services/market-data/kline-data.service';
import { BacktestOrdersChartBaseComponent } from '@/app/strategy-backtest/backtest-orders-chart-base.component';
import { ExKlineDataService } from '@/services/market-data/ex-kline-data.service';


@Component({
  standalone: false,
  selector: 'strategy-backtest-orders-chart',
  templateUrl: './orders-chart.component.html',
})
export class BacktestOrdersChartComponent extends BacktestOrdersChartBaseComponent {

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected override stService: BacktestStrategyService,
              protected override klineDataService: KlineDataService,
              protected override exKlineDataService: ExKlineDataService,
              protected activatedRoute: ActivatedRoute,
  ) {
    super(themeService, sessionService, stService, klineDataService, exKlineDataService);

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const strategyId = +paramMap.get('id');
      if (this.strategy?.id === strategyId) {
        this.refresh();
        return;
      }
      stService.getById2(strategyId).subscribe(st => {
        this.strategy = st;
        this.setParams();

        stService.getOrders(strategyId).subscribe(result => {
          st.orders = result.list;
          this.refresh();
        });
      });
    });
  }
}
