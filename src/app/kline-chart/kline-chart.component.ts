import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import rawData from './k1d.json'
import { Kline } from '../../models/kline';
import { priceFormatter, volumeFormatter } from '../../common/utils';


export interface ChartKline extends Kline {
  i: number;
  up: 1 | -1;
  ma5?: number;
  ma10?: number;
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

  currentKline: ChartKline;


  async ngOnInit() {
  }

  async ngAfterViewInit() {

    type EChartsOption = echarts.EChartsOption;

    const holder = this.chartDiv!.nativeElement as HTMLDivElement;
    this.chart = echarts.init(holder, null,
      {
        // renderer: 'svg',
        // locale: 'ZH'
      });
    var myChart = this.chart;
    var option: EChartsOption;

    const upColor = 'rgb(51,189,101)';
    const downColor = 'rgb(235,75,109)';
    // const upColor = 'rgba(0,202,60,0.7)';
    // const downColor = 'rgba(204,0,28,0.7)';
    const volUpColor = 'rgba(0,202,60,0.5)';
    const volDownColor = 'rgba(204,0,28,0.5)';

    let ii = 0;
    const klines: ChartKline[] = rawData
      .map((k: Kline) => {
        if (k.p_ch == null) {
          k.p_ch = k.close - k.open;
          k.p_avg = k.size > 0 ? k.amount / k.size : 0;
          k.p_cp = (k.p_ch / k.open) * 100.0;
          k.p_ap = (Math.abs(k.high - k.low) / k.low) * 100.0;
        }
        const kl = k as ChartKline;
        kl.i = ii;
        kl.up = kl.close >= kl.open ? 1 : -1;
        kl.time = new Date(kl.time).getTime() as any;
        return kl;
      });

    function calculateMA(data: ChartKline[], n: number) {
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

    calculateMA(klines, 5);
    calculateMA(klines, 10);

    const dimensions: (keyof ChartKline)[] = [
      'i', 'time',
      'open', 'high', 'low', 'close',
      'amount', 'up', 'ma5', 'ma10'
    ]

    function getValueFormatter(formatter: (v) => string) {
      return (value, dataIndex: number) => {
        if (Array.isArray(value)) {
          return value.map(formatter).join(`<br />\n`);
        }
        return formatter(value as number);
      }
    }

    const volBarRenderItem: echarts.CustomSeriesRenderItem = function (params, api) {
      const ts = api.value('time') as number;
      var amount = api.value('amount') as number;
      // const v2 = api.value(2);
      const HOUR = 60 * 60 * 1000;
      var start = api.coord([ts - 8 * HOUR, amount]);
      var end = api.coord([ts + 8 * HOUR, amount]);
      const s = api.size([0, amount]);
      var height = s[1];

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

    console.log(klines);

    option = {
      animation: false,
      dataset: {
        dimensions,
        source: klines as any[],
      },
      legend: {
        top: 10,
        // right: 0,
        left: 10,
        data: ['MA5', 'MA10']
      },
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
          const ps = params as {
            seriesType: string,
            seriesName: string,
            seriesIndex: number,
            marker: string,
            value: ChartKline
          }[];
          // console.log(params);
          const { marker, value: kl } = ps.find(p => p.seriesType === 'candlestick');
          this.currentKline = kl;
          return undefined;
          // return [[kl.o, 'open'], [kl.h, 'high'], [kl.l, 'low'], [kl.c, 'close']]
          //   .map(([v, n]) => `${marker} ${n} ${v}`)
          //   .join('<br/>');
        },
        // valueFormatter: function (params: any) {
        //   console.log(params);
        //   return undefined;
        // },
        position: function (pos, params, el, elRect, size) {
          const obj: Record<string, number> = {
            top: 10
          };
          const lr = (pos[0] < size.viewSize[0] / 2) ? 'right' : 'left';
          obj[lr] = 30;
          return obj;
        },
        // extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ],
        // label: {
        //   // show: true,
        //   backgroundColor: '#777',
        //   // formatter: (params) => {
        //   //   const { seriesData, axisDimension, axisIndex, value } = params;
        //   //   console.log(params);
        //   //   if (axisDimension === 'y') {
        //   //     // console.log(params);
        //   //     if (axisIndex === 1) { // Volume
        //   //       return volumeFormatter(value as number);
        //   //     }
        //   //     if (typeof value === 'number') {
        //   //       return value.toPrecision(6);
        //   //     }
        //   //   }
        //   //   return value.toString();
        //   // }
        // }
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
            color: volUpColor,
          },
          {
            value: -1,
            color: volDownColor,
          }
        ]
      },
      grid: [
        {
          left: 20,
          right: 80,
          height: '50%'
        },
        {
          left: 20,
          right: 80,
          top: '58%',
          height: '16%'
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
      series: [
        {
          name: 'Kline',
          type: 'candlestick',
          barWidth: '60%',
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined
          },
          // tooltip: {
          //   valueFormatter: function (v) {
          //     if (Array.isArray(v)) {
          //       return v.map(item => {
          //         if (typeof item === 'number') {
          //           return item.toPrecision(6)
          //         }
          //         return item.toString();
          //       }).join('\n');
          //     }
          //     if (typeof v === 'number') {
          //       return v.toPrecision(6)
          //     }
          //     return v.toString();
          //   }
          // },
          datasetIndex: 0,
          // dimensions: [
          //   { name: 'time', displayName: '时间' },
          //   { name: 'open', displayName: '开盘' },
          //   { name: 'close', displayName: '收盘' },
          //   { name: 'low', displayName: '最低' },
          //   { name: 'high', displayName: '最高' },
          // ],
          encode: {
            x: 'time',
            y: ['open', 'close', 'low', 'high'],
            tooltip: ['open', 'close', 'low', 'high'],
          },
        },
        {
          name: 'Volume',
          // type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          datasetIndex: 0,
          encode: {
            x: 'time',
            y: ['amount'],
            // tooltip: ['amount']
          },
          type: 'custom',
          renderItem: volBarRenderItem,
          tooltip: {
            valueFormatter: getValueFormatter(volumeFormatter)
          },
        },
        {
          name: 'MA5',
          type: 'line',
          datasetIndex: 0,
          encode: {
            x: 'time',
            y: 'ma5',
            // tooltip: ['a']
          },
          smooth: true,
          lineStyle: {
            opacity: 0.5
          },
          tooltip: {
            valueFormatter: getValueFormatter(priceFormatter)
          },
        },
        {
          name: 'MA10',
          type: 'line',
          datasetIndex: 0,
          encode: {
            x: 'time',
            y: 'ma10',
            // tooltip: ['a']
          },
          smooth: true,
          lineStyle: {
            opacity: 0.5
          },
          tooltip: {
            valueFormatter: getValueFormatter(priceFormatter)
          },
        }
      ]
    };

    myChart.setOption(option, true);

    // myChart.dispatchAction({
    //   type: 'brush',
    //   areas: [
    //     {
    //       brushType: 'lineX',
    //       coordRange: ['2016-06-02', '2016-06-20'],
    //       xAxisIndex: 0
    //     }
    //   ]
    // });

    myChart.setOption(option);

    myChart.on('mouseout', () => {
      this.currentKline = undefined;
    });
    myChart.on('globalout', () => {
      this.currentKline = undefined;
    });

  }
}
