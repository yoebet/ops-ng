import { Component } from '@angular/core';
import rawData from './k1d.json'
import { Kline } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import { KlineChartBaseComponent } from './kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ChartKline, transformKline } from '@/app/kline-chart/kline-chart-data';
import { KlineDataService } from '@/services/strategy/kline-data.service';


@Component({
  selector: 'kline-chart',
  standalone: false,
  templateUrl: './kline-chart.component.html',
  styleUrl: './kline-chart.component.css'
})
export class KlineChartComponent extends KlineChartBaseComponent {
  protected override mas = [10];

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected klineDataService: KlineDataService) {
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
