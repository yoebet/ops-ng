import { Component } from '@angular/core';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { KlineDataService } from '@/services/strategy/kline-data.service';
import { BacktestOrdersChartBaseComponent } from '@/app/strategy-backtest/backtest-orders-chart-base.component';


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
              protected activatedRoute: ActivatedRoute,
  ) {
    super(themeService, sessionService, stService, klineDataService);

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const strategyId = paramMap.get('id');
      stService.getById2(+strategyId).subscribe(st => {
        this.setParams();

        stService.getOrders(+strategyId).subscribe(result => {
          st.orders = result.list;
          this.refresh();
        });
      });
    });
  }
}
