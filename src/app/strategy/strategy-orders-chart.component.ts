import { Component } from '@angular/core';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { KlineDataService } from '@/services/market-data/kline-data.service';
import { StrategyOrdersChartBaseComponent } from '@/app/strategy/strategy-orders-chart-base.component';
import { StrategyService } from '@/services/strategy/strategy.service';
import { ExKlineDataService } from '@/services/market-data/ex-kline-data.service';


@Component({
  standalone: false,
  selector: 'strategy-orders-chart',
  templateUrl: './orders-chart.component.html',
})
export class StrategyOrdersChartComponent extends StrategyOrdersChartBaseComponent {

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected override stService: StrategyService,
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
