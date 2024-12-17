import { Routes } from '@angular/router';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';
import { StrategiesComponent } from '@/app/strategy/strategies.component';
import { BacktestStrategiesComponent } from '@/app/strategy-backtest/backtest-strategies.component';

export const routes: Routes = [
  { path: 'kline', component: KlineChartComponent },
  { path: 'templates', component: StrategyTemplatesComponent },
  { path: 'strategies', component: StrategiesComponent },
  { path: 'bt-strategies', component: BacktestStrategiesComponent },
];
