import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import rawData from './d.json'

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
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

    const upColor = 'rgba(40,255,40,0.6)';
    const downColor = 'rgba(255,80,80,0.6)';

    function splitData(rawData: number[][]) {
      let categoryData = [];
      let values = [];
      let volumes = [];
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
      }

      return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
      };
    }

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

    var data = splitData(rawData as any[]);

    option = {
      animation: false,
      legend: {
        bottom: 10,
        left: 'center',
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
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: downColor
          },
          {
            value: -1,
            color: upColor
          }
        ]
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: '50%'
        },
        {
          left: '10%',
          right: '8%',
          top: '58%',
          height: '16%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          // splitLine: { show: true },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            z: 100
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: data.categoryData,
          boundaryGap: false,
          axisLine: { show: true },
          axisTick: { show: true },
          axisLabel: { show: true },
          // splitLine: { show: true },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          },
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
          data: data.values,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: undefined,
            borderColor0: undefined
          }
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: data.volumes,
        },
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(5, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
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

  }
}
