import { Component, Inject } from '@angular/core';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { KlineDataService } from '@/services/strategy/kline-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrategyService } from '@/services/strategy/strategy.service';
import { Strategy } from '@/models/strategy/strategy';
import { StrategyOrdersChartBaseComponent } from '@/app/strategy/strategy-orders-chart-base.component';


@Component({
  standalone: false,
  selector: 'strategy-orders-chart-dialog',
  templateUrl: './orders-chart-dialog.component.html',
})
export class StrategyOrdersChartDialogComponent extends StrategyOrdersChartBaseComponent {

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected override stService: StrategyService,
              protected override klineDataService: KlineDataService,
              @Inject(MAT_DIALOG_DATA) public data: Strategy,
  ) {
    super(themeService, sessionService, stService, klineDataService);

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
