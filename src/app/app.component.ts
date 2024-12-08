import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ECharts } from 'echarts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('chart') chartDiv: ElementRef|undefined;
  chart: ECharts|undefined;

  title = 'ops-ng';

  chartWidth = '100%';
  chartHeight = 400;

}
