import { Routes } from '@angular/router';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';
import { StrategiesComponent } from '@/app/strategy/strategies.component';
import { BacktestStrategiesComponent } from '@/app/strategy-backtest/backtest-strategies.component';
import { BacktestOrdersChartComponent } from '@/app/strategy-backtest/backtest-orders-chart.component';

export const routes: Routes = [
  { path: 'klines', component: KlineChartComponent },
  { path: 'templates', component: StrategyTemplatesComponent },
  { path: 'paper-strategies', component: StrategiesComponent, data: { type: 'paper' } },
  { path: 'real-strategies', component: StrategiesComponent, data: { type: 'real' } },
  { path: 'strategies', component: StrategiesComponent },
  { path: 'bt-strategies', component: BacktestStrategiesComponent },
  { path: 'bt-strategies/:id/orders-chart', component: BacktestOrdersChartComponent },
];
