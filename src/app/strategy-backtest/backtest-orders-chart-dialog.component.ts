import { Component, Inject } from '@angular/core';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';
import { KlineDataService } from '@/services/market-data/kline-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BacktestOrdersChartBaseComponent } from '@/app/strategy-backtest/backtest-orders-chart-base.component';
import { ExKlineDataService } from '@/services/market-data/ex-kline-data.service';


@Component({
  standalone: false,
  selector: 'strategy-backtest-orders-chart-dialog',
  templateUrl: './orders-chart-dialog.component.html',
})
export class BacktestOrdersChartDialogComponent extends BacktestOrdersChartBaseComponent {

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected override stService: BacktestStrategyService,
              protected override klineDataService: KlineDataService,
              protected override exKlineDataService: ExKlineDataService,
              @Inject(MAT_DIALOG_DATA) public data: BacktestStrategy,
  ) {
    super(themeService, sessionService, stService, klineDataService, exKlineDataService);

    this.strategy = data;

    this.setParams();

    if (!this.strategy.orders) {
      stService.getOrders(this.strategy.id).subscribe(result => {
        this.strategy.orders = result.list;
        this.refresh();
      });
    } else {
      this.refresh();
    }
  }
}
