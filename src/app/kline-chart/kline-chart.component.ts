import { Component } from '@angular/core';
import { Kline, KlineParams } from '@/models/kline';
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

  timeLevels = TimeLevel.TL1mTo1d;
  exchanges = ['binance', 'okx'];
  symbols = ['BTC', 'ETH', 'DOGE'].map(c => `${c}/USDT`);
  limits = [100, 200, 300];

  params: KlineParams = {
    ex: this.exchanges[0],
    symbol: this.symbols[0],
    interval: '1d',
    limit: this.limits[0],
  };

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected klineDataService: KlineDataService) {
    super(themeService, sessionService);
  }

  override async ngOnInit() {
    await super.ngOnInit();
  }

  refresh() {
    const params = this.params;
    const timeLevel: TimeLevel = this.timeLevels.find(tl => tl.interval === params.interval);
    this.klineDataService.query(params).subscribe((kls: Kline[]) => {
      const klines: ChartKline[] = transformKline(kls,
        this.mas,
        this.bbOptions);
      this.chartData = {
        es: { ex: params.ex, symbol: params.symbol },
        // priceDigits: 2,
        timeLevel,
        klines,
      };

      this.updateChartData();
    });
  }

  timeLevelSelected(tl: TimeLevel) {
    this.params.interval = tl.interval;
    this.refresh();
  }
}
