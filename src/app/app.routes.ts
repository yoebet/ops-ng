import { Routes } from '@angular/router';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';
import { StrategiesComponent } from '@/app/strategy/strategies.component';
import { BacktestStrategiesComponent } from '@/app/strategy-backtest/backtest-strategies.component';
import { BacktestOrdersChartComponent } from '@/app/strategy-backtest/backtest-orders-chart.component';
import { StrategyOrdersChartComponent } from '@/app/strategy/strategy-orders-chart.component';

export const routes: Routes = [
  { path: 'klines', component: KlineChartComponent },
  { path: 'templates', component: StrategyTemplatesComponent },
  { path: 'real-strategies', component: StrategiesComponent, data: { type: 'real' } },
  { path: 'paper-strategies', component: StrategiesComponent, data: { type: 'paper' } },
  { path: 'strategies', component: StrategiesComponent },
  { path: 'strategies/:id/orders-chart', component: StrategyOrdersChartComponent },
  { path: 'real-strategies/:id/orders-chart', component: StrategyOrdersChartComponent },
  { path: 'paper-strategies/:id/orders-chart', component: StrategyOrdersChartComponent },
  { path: 'bt-strategies', component: BacktestStrategiesComponent },
  { path: 'bt-strategies/:id/orders-chart', component: BacktestOrdersChartComponent },
];
