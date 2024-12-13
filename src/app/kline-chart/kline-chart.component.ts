import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import rawData from './k1d.json'
import { ES, Kline } from '../../models/kline';
import { priceFormatter, volumeFormatter } from '../../common/utils';
import { TimeLevel } from '../../models/time-level';
import * as _ from 'lodash';

type EChartsOption = echarts.EChartsOption;


export interface ChartKline extends Kline {
  i: number;
  up: 1 | -1;
  // ma5?: number;
  // ma10?: number;
  bbMa?: number;
  bbUpper?: number;
  bbLower?: number;
}

@Component({
  selector: 'kline-chart',
  standalone: false,
  templateUrl: './kline-chart.component.html',
  styleUrl: './kline-chart.component.css'
})
export class KlineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chartDiv!: ElementRef;
  chart!: ECharts;

  title = 'ops-ng';

  chartWidth = '100%';
  chartHeight = 600;

  chartInitialized = false;

  windowWidth: number;
  resetChartHandler: ReturnType<typeof setTimeout>;
  mas = [/*10, 20*/];
  bollingerBandOptions = { n: 20, times: 2 }
  // protected upColor = 'rgba(0,202,60,0.7)';
  basicDimensions: (keyof ChartKline)[] = [
    'i', 'ts',
    'open', 'high', 'low', 'close',
    'amount', 'up'
  ];
  chartData: {
    es: ES;
    timeLevel: TimeLevel;
    klines?: ChartKline[];
    currentKline?: ChartKline;
  }
  protected upColor = 'rgb(51,189,101)';
  protected downColor = 'rgb(235,75,109)';
  // protected downColor = 'rgba(204,0,28,0.7)';
  protected volUpColor = 'rgba(0,202,60,0.5)';
  protected volDownColor = 'rgba(204,0,28,0.5)';

  async ngOnInit() {
  }

  ngAfterViewInit() {
    this.resetChart();
    setTimeout(() => {
      this.updateData();
    }, 1000);
  }

  getDimensions(): string[] {
    return (this.basicDimensions as string[])
      .concat(this.mas.map(m => `ma${m}`))
      .concat('bbUpper', 'bbMa', 'bbLower');
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.windowWidth === window.innerWidth) {
      return;
    }
    this.windowWidth = window.innerWidth;
    if (!this.chartInitialized) {
      return;
    }
    if (this.resetChartHandler) {
      clearTimeout(this.resetChartHandler);
    }
    this.resetChartHandler = setTimeout(() => {
      this.resetChart();
    }, 200);
  }

  buildChartOption(): EChartsOption {

    const dimensions = this.getDimensions();
    const chartData = this.chartData;
    const series = this.buildSeries();
    const legend = this.getLegendOptions();
    const option: EChartsOption = {
      animation: false,
      title: {
        top: 10,
        text: `Candlestick`,
        subtext: ``
      },
      dataset: {
        dimensions,
        source: chartData?.klines || [] as any[],
      },
      legend,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
        formatter: (params: any[]) => {
          if (!this.chartData) {
            return undefined;
          }
          const ps = params as {
            seriesType: string,
            seriesName: string,
            seriesIndex: number,
            value: ChartKline
          }[];
          // console.log(params);
          const { value: kl } = ps.find(p => p.seriesType === 'candlestick');
          this.chartData.currentKline = kl;
          setTimeout(() => {
            this.updateTitle();
          }, 0);
          return undefined;
        },
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ],
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          },
          brush: {
            type: ['lineX', 'clear']
          }
        }
      },
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          colorAlpha: 0.1
        }
      },
      visualMap: {
        show: false,
        seriesIndex: 1,
        dimension: 'up' as any,
        pieces: [
          {
            value: 1,
            color: this.volUpColor,
          },
          {
            value: -1,
            color: this.volDownColor,
          }
        ]
      },
      grid: [
        {
          left: 20,
          right: 80,
          height: '55%'
        },
        {
          left: 20,
          right: 80,
          top: '63%',
          height: '16%'
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
          end: 50
        },
        {
          type: 'slider',
          // show: true,
          xAxisIndex: [0, 1],
          top: '85%',
          start: 0,
          end: 50
        }
      ],
      xAxis: [
        {
          type: 'time',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          // splitLine: { show: true },
          // min: 'dataMin',
          // max: 'dataMax',
          axisPointer: {
            z: 100,
            label: {
              show: false
            }
          }
        },
        {
          type: 'time',
          gridIndex: 1,
          axisLine: { show: true },
          axisTick: { show: true },
          axisLabel: { show: true },
          // splitLine: { show: true },
          // min: 'dataMin',
          // max: 'dataMax',
          axisPointer: {
            z: 100
          }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          },
          position: 'right',
          // axisLine: {
          //   show: true,
          //   lineStyle: {
          //     color: 'rgba(0, 0, 0, 0.5)'
          //   }
          // }
        },
        {
          scale: false,
          gridIndex: 1,
          splitNumber: 2,
          position: 'right',
          axisLabel: { show: false },
          // axisLine: {
          //   show: true,
          //   lineStyle: {
          //     color: 'rgba(0, 0, 0, 0.5)'
          //   }
          // },
          axisTick: { show: false },
          splitLine: { show: false },
        }
      ],
      series
    };

    return option;
  }

  setupChart(): void {
    const option = this.buildChartOption();
    if (!option) {
      return;
    }
    const chart = this.chart;
    chart.setOption(option, true);
    const clearCurrentKline = () => {
      if (this.chartData) {
        this.chartData.currentKline = undefined;
      }
      this.updateTitle()
    };
    chart.on('mouseout', clearCurrentKline);
    chart.on('globalout', clearCurrentKline);
  }

  resetChart(): void {
    if (this.chart) {
      this.chart.dispose();
    }
    const holder = this.chartDiv!.nativeElement as HTMLDivElement;
    this.chart = echarts.init(holder, null, {
      // renderer: 'svg',
      // locale: 'ZH'
    });

    this.setupChart();
    this.chartInitialized = true;
  }

  updateTitle() {
    const { es, timeLevel, currentKline: kl } = this.chartData || {};
    const title = es && timeLevel ? `${es.ex} ${es.symbol} ${timeLevel.interval}` : '';
    let info: string;
    if (kl) {
      const vs = [
        ['O', kl.open], ['C', kl.close], ['H', kl.high], ['L', kl.low],
        ['CH', `${kl.p_cp.toFixed(2)}%`],
        ['AP', `${kl.p_ap.toFixed(2)}%`],
        ['BVP', `${kl.v_bp.toFixed(2)}%`]
      ].map(nv => nv.join(' ')).join('  ');
      info = `${new Date(kl.ts).toISOString()} ${vs}`;
    }
    this.chart.setOption({
      title: {
        text: title,
        subtext: info
      }
    });
  }

  updateData() {
    const klines = this.transformKline(rawData as any[] as Kline[]);
    this.chartData = {
      es: { ex: 'binance', symbol: 'BTC/USDT' },
      timeLevel: TimeLevel.TL1mTo1d.slice(-1)[0],
      klines,
    };

    if (!this.chart) {
      return;
    }
    const dimensions = this.getDimensions();
    this.chart.setOption({
      dimensions,
      dataset: {
        source: klines,
      },
    } as EChartsOption);
  }

  protected getValueFormatter(formatter: (v) => string) {
    return (value, dataIndex: number) => {
      if (Array.isArray(value)) {
        return value.map(formatter).join(`<br />\n`);
      }
      return formatter(value as number);
    }
  }

  protected volBarRenderItem: echarts.CustomSeriesRenderItem = function (params, api) {
    const ts = api.value('ts') as number;
    let amount = api.value('amount') as number;
    // const v2 = api.value(2);
    const HOUR = 60 * 60 * 1000;
    let start = api.coord([ts - 8 * HOUR, amount]);
    let end = api.coord([ts + 8 * HOUR, amount]);
    const s = api.size([0, amount]);
    let height = s[1];

    // console.log(params);

    const shape = {
      x: start[0],
      y: start[1],
      width: end[0] - start[0],
      height: height
    };

    return {
      type: 'rect',
      shape: shape,
      style: api.style()
      // style: {
      //   "fill": "rgba(0,202,60,0.5)",
      //   "textPosition": "inside",
      //   "textDistance": 5,
      //   "fontStyle": "normal",
      //   "fontWeight": "normal",
      //   "fontSize": 12,
      //   "fontFamily": "sans-serif",
      //   "textFill": "#fff",
      //   "textStroke": "rgba(0,202,60,0.5)",
      //   "textStrokeWidth": 2,
      //   "text": null,
      //   "legacy": true
      // }
    };
  };

  protected getLegendOptions(): EChartsOption['legend'] {
    return {
      top: 10,
      align: 'auto',
      // right: 10,
      // left: 10,
      data: this.mas.map(m => `MA${m}`).concat('bbUpper', 'bbMa', 'bbLower')
    }
  }

  protected buildBaseSeries(): EChartsOption['series'] {

    return [
      {
        name: 'Kline',
        type: 'candlestick',
        barWidth: '60%',
        itemStyle: {
          color: this.upColor,
          color0: this.downColor,
          borderColor: undefined,
          borderColor0: undefined
        },
        datasetIndex: 0,
        encode: {
          x: 'ts',
          y: ['open', 'close', 'low', 'high'],
        },
      },
      {
        name: 'Volume',
        // type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        datasetIndex: 0,
        encode: {
          x: 'ts',
          y: ['amount'],
          // tooltip: ['amount']
        },
        type: 'custom',
        renderItem: this.volBarRenderItem,
        tooltip: {
          valueFormatter: this.getValueFormatter(volumeFormatter)
        },
      },]
  }

  protected buildSeries(): EChartsOption['series'] {
    return [
      ...this.buildBaseSeries() as [],
      ...(this.mas || []).map((m) => ({
        name: `MA${m}`,
        type: 'line',
        datasetIndex: 0,
        encode: {
          x: 'ts',
          y: `ma${m}`,
        },
        smooth: true,
        lineStyle: {
          opacity: 0.5
        },
        tooltip: {
          show: false
        }
      } as EChartsOption['series'])) as [],
      ...(this.bollingerBandOptions ? ['bbUpper', 'bbMa', 'bbLower'] : []).map((m) => ({
        name: m,
        type: 'line',
        datasetIndex: 0,
        encode: {
          x: 'ts',
          y: m,
        },
        smooth: true,
        lineStyle: {
          opacity: 0.5
        },
        tooltip: {
          show: false
        }
      } as EChartsOption['series'])) as [],
    ];
  }

  protected calculateMA(data: ChartKline[], n: number) {
    let sum = 0;
    let lastKl0: ChartKline;
    for (let i = 0; i < data.length; i++) {
      const kl = data[i];
      const fromIndex = i - n + 1;
      sum += kl.p_avg;
      if (fromIndex < 0) {
        continue;
      }
      if (lastKl0) {
        sum -= lastKl0.p_avg;
      }
      kl[`ma${n}`] = sum / n;
      lastKl0 = data[fromIndex];
    }
  }

  protected evalBBand(
    klines: ChartKline[],
    stdTimes = 2,
  ) {
    const kl = klines[klines.length - 1];
    const prices = klines.filter((k) => k.size > 0).map((k) => k.amount / k.size);
    const ma = _.sum(prices) / prices.length;
    const sqs = prices.map((p) => Math.pow(p - ma, 2));
    const std = Math.sqrt(_.sum(sqs) / sqs.length);
    const kstd = std * stdTimes;
    kl.bbMa = ma;
    kl.bbLower = ma - kstd;
    kl.bbUpper = ma + kstd;
  }

  protected evalBBands(
    klines: ChartKline[],
  ) {
    const { n, times } = this.bollingerBandOptions;
    const len = klines.length - 1;
    for (let i = n - 1; i < len; i++) {
      const kls = klines.slice(i - n + 1, i);
      this.evalBBand(kls, times);
    }
  }

  protected transformKline(kls: Kline[]) {
    let ii = 0;
    const klines: ChartKline[] = kls
      .map((k: Kline) => {
        k.ts = new Date(k.time).getTime();
        if (k.v_bp == null) {
          k.p_ch = k.close - k.open;
          k.p_avg = k.size > 0 ? k.amount / k.size : 0;
          k.p_cp = (k.p_ch / k.open) * 100.0;
          k.p_ap = (Math.abs(k.high - k.low) / k.low) * 100.0;
          k.v_bp = k.size > 0 ? (k.bs / k.size) * 100.0 : 0;
        }
        const kl = k as ChartKline;
        kl.i = ii;
        kl.up = kl.close >= kl.open ? 1 : -1;
        return kl;
      });

    if (this.mas) {
      for (const ma of this.mas) {
        this.calculateMA(klines, ma);
      }
    }

    if (this.bollingerBandOptions) {
      this.evalBBands(klines);
    }

    return klines;
  }
}
