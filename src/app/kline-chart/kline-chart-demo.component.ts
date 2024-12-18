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
  selector: 'kline-chart-demo',
  standalone: false,
  templateUrl: './kline-chart-demo.component.html',
  styleUrl: './kline-chart-demo.component.css'
})
export class KlineChartDemoComponent extends KlineChartBaseComponent {
  protected override mas = [10];

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,) {
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
    const timeLevel = TimeLevel.TL1mTo1d.slice(-1)[0];
    this.chartData = {
      es: { ex: 'binance', symbol: 'ETH/USDT' },
      // priceDigits: 2,
      timeLevel,
      klines,
    };

    klines.forEach(kl => {
      kl.buyOrder = Math.random() < 0.1 ? {} as any : undefined;
      kl.sellOrder = Math.random() < 0.1 ? {} as any : undefined;
    })

    this.updateChartData();
  }
}
