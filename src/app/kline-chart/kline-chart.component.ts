import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import rawData from './d.json'
import { Kline } from '../../models/kline';


export interface ChartKline extends Kline {
  i: number;
  ds: string;
  up: 1 | -1;
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

    // const upColor = 'rgb(51,189,101)';
    // const downColor = 'rgb(235,75,109)';
    const upColor = 'rgba(0,202,60,0.7)';
    const downColor = 'rgba(204,0,28,0.7)';
    const volUpColor = 'rgba(0,202,60,0.5)';
    const volDownColor = 'rgba(204,0,28,0.5)';

    function calculateMA(dayCount: number, data: { values: number[][] }) {
      var result = [];
      for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
      }
      return result;
    }

    let ii = 0;
    const klines: ChartKline[] = (rawData as [ds: string,
      o: number, c: number, h: number, l: number,
      a: number][])
      .map(([ds, o, c, h, l, a]) => {
        const kl: ChartKline = {
          i: ii++,
          ts: 0,
          o,
          h,
          l,
          c,
          s: 0,
          a,
          ds,
          up: o >= c ? -1 : 1,
        };
        return kl;
      });

    const dimensions: (keyof ChartKline)[] = ['i', 'ds', 'o', 'h', 'l', 'c', 'a', 'up']

    option = {
      animation: false,
      dataset: {
        dimensions,
        source: klines as any[],
      },
      // legend: {
      //   top: 10,
      //   // right: 0,
      //   left: 10,
      //   data: ['MA5', 'MA10']
      // },
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
        // formatter: function (params: any) {
        //   console.log(params);
        //   return undefined;
        // },
        // valueFormatter: function (params: any) {
        //   console.log(params);
        //   return undefined;
        // },
        position: function (pos, params, el, elRect, size) {
          const obj: Record<string, number> = {
            top: 10
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        }
        // extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ],
        label: {
          // show: true,
          backgroundColor: '#777'
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
        // dimension: 1,
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
          type: 'category',
          boundaryGap: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          // splitLine: { show: true },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100,
            label: {
              show: false
            }
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          boundaryGap: false,
          axisLine: { show: true },
          axisTick: { show: true },
          axisLabel: { show: true },
          // splitLine: { show: true },
          min: 'dataMin',
          max: 'dataMax',
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
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          position: 'right',
          axisLabel: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.5)'
            }
          },
          axisTick: { show: false },
          splitLine: { show: false },
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 98,
          end: 100
        },
        {
          type: 'slider',
          // show: true,
          xAxisIndex: [0, 1],
          top: '85%',
          start: 98,
          end: 100
        }
      ],
      series: [
        {
          name: 'Dow-Jones index',
          type: 'candlestick',
          barWidth: '60%',
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined
          },
          datasetIndex: 0,
          dimensions: [
            { name: 'ds', displayName: '时间' },
            { name: 'o', displayName: '开盘' },
            { name: 'c', displayName: '收盘' },
            { name: 'l', displayName: '最低' },
            { name: 'h', displayName: '最高' },
          ],
          encode: {
            x: 'ds',
            y: ['o', 'c', 'l', 'h'],
            tooltip: ['o', 'c', 'l', 'h']
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          datasetIndex: 0,
          encode: {
            x: 'ds',
            y: ['a', 'up'],
            tooltip: ['a']
          },
        },
        // {
        //   name: 'MA5',
        //   type: 'line',
        //   data: calculateMA(5, data),
        //   smooth: true,
        //   lineStyle: {
        //     opacity: 0.5
        //   }
        // },
        // {
        //   name: 'MA10',
        //   type: 'line',
        //   data: calculateMA(10, data),
        //   smooth: true,
        //   lineStyle: {
        //     opacity: 0.5
        //   }
        // }
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

  }
}
