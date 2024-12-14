import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import { ES, Kline } from '../../models/kline';
import { formatDate, volumeFormatter } from '../../common/utils';
import { TimeLevel } from '../../models/time-level';

type EChartsOption = echarts.EChartsOption;

export interface KlineOrders {
  side: 'buy' | 'sell';
  count: number;
  avgPrice: number;
}

export interface ChartKline extends Kline {
  i: number;
  up: 1 | -1;
  // ma5?: number;
  // ma10?: number;
  bbMa?: number;
  bbUpper?: number;
  bbLower?: number;
  buyOrder?: KlineOrders;
  sellOrder?: KlineOrders;
  dateStr?: string;
  dateStrLocal?: string;
  size_s?: string;
  amount_s?: string;
  p_cp_s?: string;
  p_ap_s?: string;
  v_bp_s?: string;
  open_s?: string;
  high_s?: string;
  low_s?: string;
  close_s?: string;
}

@Component({
  template: '',
})
export abstract class KlineChartBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chartDiv!: ElementRef;
  protected chart!: ECharts;

  protected chartWidth = '100%';
  protected chartHeight = 600;

  protected windowWidth: number;
  protected resetChartHandler: ReturnType<typeof setTimeout>;
  protected mas = [/*10, 20*/];
  protected bollingerBandOptions = { n: 20, times: 2 };
  protected bollingerBandNames: { name: string, field: string }[] = [
    { name: 'BB-Lower', field: 'bbLower' },
    { name: 'BB-MA', field: 'bbMa' },
    { name: 'BB-Upper', field: 'bbUpper' }];
  // protected upColor = 'rgba(0,202,60,0.7)';
  protected basicDimensions: (keyof ChartKline)[] = [
    'i', 'ts',
    'open', 'high', 'low', 'close',
    'amount', 'up'
  ];
  protected chartData: {
    es: ES;
    priceDigits?: number;
    timeLevel: TimeLevel;
    klines?: ChartKline[];
    currentKline?: ChartKline;
  }
  protected upColor = 'rgb(51,189,101)';
  protected downColor = 'rgb(235,75,109)';
  protected volUpColor = 'rgba(0,202,60,0.5)';
  protected volDownColor = 'rgba(204,0,28,0.5)';
  protected buyMarkerColor = 'rgba(41,200,85,1)';
  protected sellMarkerColor = 'rgba(200,60,85,1)';

  async ngOnInit() {
  }

  ngAfterViewInit() {
    this.resetChart();
  }

  getDimensions(): string[] {
    return (this.basicDimensions as string[])
      .concat(this.mas.map(m => `ma${m}`))
      .concat(this.bollingerBandNames.map(b => b.field))
      .concat(['buyOrder', 'sellOrder']);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.windowWidth === window.innerWidth) {
      return;
    }
    this.windowWidth = window.innerWidth;
    if (!this.chart) {
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
        text: ``,
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
        label: {
          // show: true,
          // backgroundColor: '#777',
          formatter: (params) => {
            const { seriesData, axisDimension, axisIndex, value } = params;
            // console.log(params);
            if (axisDimension === 'y') {
              if (axisIndex === 1) { // Volume
                return volumeFormatter(value as number);
              }
              if (typeof value === 'number') {
                const priceDigits = this.chartData?.priceDigits || 2
                return value.toPrecision(priceDigits);
              }
              return undefined;
            }
            // value: ts
            const kl = seriesData[0]?.data as ChartKline;
            if (!kl) {
              return undefined;
            }
            if (!kl.dateStrLocal) {
              kl.dateStrLocal = formatDate(kl.ts, this.chartData?.timeLevel?.interval, false);
            }
            return kl.dateStrLocal;
          }
        }
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
          // start: 0,
          // end: 100
        },
        {
          type: 'slider',
          // show: true,
          xAxisIndex: [0, 1],
          top: '85%',
          // start: 0,
          // end: 100
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

  setupChart(option?: EChartsOption): void {
    if (!option) {
      console.log('build ...')
      option = this.buildChartOption();
    }
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

  resetChart(rebuildOption = false): void {
    let opt: EChartsOption;
    if (this.chart) {
      opt = this.chart.getOption() as EChartsOption;
      this.chart.dispose();
    }
    const holder = this.chartDiv!.nativeElement as HTMLDivElement;
    this.chart = echarts.init(holder, null, {
      // renderer: 'svg',
      // locale: 'ZH'
    });

    this.setupChart(!rebuildOption && opt || undefined);
  }

  updateTitle() {
    const { es, timeLevel, currentKline: kl, priceDigits = 2 } = this.chartData || {};
    const title = es && timeLevel ? `${es.ex} ${es.symbol} ${timeLevel.interval}` : '';
    let info: string;
    if (kl) {
      if (!kl.dateStr) {
        kl.dateStr = formatDate(kl.ts, timeLevel.interval, true);
        kl.size_s = volumeFormatter(kl.size);
        kl.amount_s = volumeFormatter(kl.amount);
        kl.open_s = `${kl.open.toFixed(priceDigits)}%`;
        kl.high_s = `${kl.high.toFixed(priceDigits)}%`;
        kl.low_s = `${kl.low.toFixed(priceDigits)}%`;
        kl.close_s = `${kl.close.toFixed(priceDigits)}%`;
        kl.p_cp_s = `${kl.p_cp.toFixed(2)}%`;
        if (kl.p_cp >= 0) {
          kl.p_cp_s = `+${kl.p_cp_s}`;
        }
        kl.p_ap_s = `${kl.p_ap.toFixed(2)}%`;
        kl.v_bp_s = `${kl.v_bp.toFixed(2)}%`;
      }
      const vs = [
        ['O', kl.open_s], ['C', kl.close_s], ['H', kl.high_s], ['L', kl.low_s],
        ['CH', kl.p_cp_s], ['AP', kl.p_ap_s],
        ['Size', kl.size_s], ['Amount', kl.amount_s], ['Buy', kl.v_bp_s],
      ].map(nv => nv.join(' ')).join('  ');
      info = `${kl.dateStr} ${vs}`;
    }
    this.chart.setOption({
      title: {
        text: title,
        textStyle: {
          fontFamily: 'monospace',
        },
        subtext: info,
        subtextStyle: {
          fontFamily: 'monospace',
        }
      }
    } as EChartsOption);
  }

  updateChartData() {
    if (!this.chartData) {
      return;
    }

    if (!this.chart) {
      return;
    }

    const klines = this.chartData.klines;
    const buyKls = klines.filter(k => k.buyOrder);
    const sellKls = klines.filter(k => k.sellOrder);

    const dimensions = this.getDimensions();
    this.chart.setOption({
      dimensions,
      dataset: {
        source: this.chartData.klines,
      },
      series: [
        {
          name: 'Kline',
          type: 'candlestick',
          markPoint: {
            name: 'NN',
            // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
            // symbol: 'arrow',
            // symbolSize: 18,
            tooltip: {
              formatter: function (param) {
                return param.name + ' ' + (param.value || '');
              },
              trigger: 'item',
            },
            label: {
              formatter: function (param) {
                return param != null ? Math.round(param.value as number) + '' : '';
              }
            },
            data: [
              {
                name: 'High',
                type: 'max',
                valueDim: 'high',
                label: {
                  formatter: function (param) {
                    return 'H';
                  }
                },
                itemStyle: {
                  color: this.upColor,
                  opacity: 0.9,
                },
                // symbol: 'rect',
              },
              {
                name: 'Low',
                type: 'min',
                valueDim: 'low',
                label: {
                  formatter: function (param) {
                    return '\n\nL';
                  }
                },
                itemStyle: {
                  color: this.downColor,
                  opacity: 0.9,
                },
                symbolRotate: 180,
              },
              ...buyKls.map(k => (
                {
                  name: 'Buy',
                  // coord: [k.ts, 3300],
                  symbol: 'circle',
                  symbolSize: 18,
                  // symbolRotate: 180,
                  xAxis: k.ts,
                  yAxis: k.low,
                  // valueDim: 'low',
                  value: k,
                  itemStyle: {
                    color: this.buyMarkerColor,
                    opacity: 0.9,
                  },
                  label: {
                    formatter: function (param) {
                      return 'B';
                    }
                  }
                })),
              ...sellKls.map(k => (
                {
                  name: 'Sell',
                  // coord: [k.ts, 3300],
                  symbol: 'circle',
                  symbolSize: 18,
                  xAxis: k.ts,
                  yAxis: k.high,
                  // valueDim: 'high',
                  value: k,
                  itemStyle: {
                    color: this.sellMarkerColor,
                    opacity: 0.9,
                  },
                  label: {
                    formatter: function (param) {
                      return 'S';
                    }
                  }
                })),
            ],
          }
        }
      ]
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
      data: this.mas.map(m => `MA${m}`)
        .concat(this.bollingerBandNames.map(b => b.name))
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
          // tooltip: ['open', 'close', 'low', 'high'],
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
      }
    ]
  }

  protected buildSeries(): EChartsOption['series'] {
    return [
      ...this.buildBaseSeries() as [],
      ...(this.mas || []).map((m) => ({
        name: `MA${m}`,
        type: 'line',
        showSymbol: false,
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
      ...this.bollingerBandNames.map((m) => ({
        name: m.name,
        type: 'line',
        showSymbol: false,
        datasetIndex: 0,
        encode: {
          x: 'ts',
          y: m.field,
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
}
