import { Routes } from '@angular/router';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';

export const routes: Routes = [
  { path: 'kline', component: KlineChartComponent },
  { path: 'templates', component: StrategyTemplatesComponent },
];
