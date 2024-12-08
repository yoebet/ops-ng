import { Component } from '@angular/core';
import { Kline, KlineParams } from '@/models/kline';
import { TimeLevel } from '@/models/time-level';
import { KlineChartBaseComponent } from './kline-chart-base.component';
import { ThemeService } from '@/services/style/theme.service';
import { SessionService } from '@/services/sys/session.service';
import { ChartKline, transformKline } from '@/app/kline-chart/kline-chart-data';
import { KlineDataService } from '@/services/market-data/kline-data.service';
import { ExKlineDataService } from '@/services/market-data/ex-kline-data.service';
import { ExchangeService } from '@/services/sys/exchange.service';
import { Option } from '@/models/base';
import { UnifiedSymbol } from '@/models/ex/unified-symbol';


@Component({
  selector: 'kline-chart',
  standalone: false,
  templateUrl: './kline-chart.component.html',
})
export class KlineChartComponent extends KlineChartBaseComponent {
  protected override mas = [10];

  klineSources = ['ex', 'db']
  klineSource = 'db';
  timeLevels = TimeLevel.TL1mTo1d;
  exchanges: Option[] = [];
  symbols: UnifiedSymbol[] = [];
  limits = [100, 300, 1000, 3000];

  params: KlineParams = {
    ex: '',
    symbol: '',
    interval: '1d',
    limit: this.limits[0],
  };

  constructor(protected override themeService: ThemeService,
              protected override sessionService: SessionService,
              protected exchangeService: ExchangeService,
              protected klineDataService: KlineDataService,
              protected exKlineDataService: ExKlineDataService) {
    super(themeService, sessionService);
    this.exchanges = exchangeService.getExchanges();
    this.params.ex = this.exchanges[0]?.value;
    exchangeService.listUnifiedSymbols().subscribe(us => {
      this.symbols = us;
      this.params.symbol = us[0]?.symbol;
    });
  }

  refresh() {
    const params = this.params;
    const timeLevel: TimeLevel = this.timeLevels.find(tl => tl.interval === params.interval);
    let obs = this.klineDataService.query(params);
    if (this.klineSource === 'ex') {
      obs = this.exKlineDataService.query(params);
    }
    obs.subscribe((kls: Kline[]) => {
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
}
