import { Routes } from '@angular/router';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';
import { StrategiesComponent } from '@/app/strategy/strategies.component';
import { BacktestStrategiesComponent } from '@/app/strategy-backtest/backtest-strategies.component';
import { BacktestOrdersChartComponent } from '@/app/strategy-backtest/backtest-orders-chart.component';
import { KlineChartDemoComponent } from '@/app/kline-chart/kline-chart-demo.component';

export const routes: Routes = [
  { path: 'kline', component: KlineChartDemoComponent },
  { path: 'klines', component: KlineChartComponent },
  { path: 'templates', component: StrategyTemplatesComponent },
  { path: 'strategies', component: StrategiesComponent },
  { path: 'bt-strategies', component: BacktestStrategiesComponent },
  { path: 'bt-strategies/:id/orders-chart', component: BacktestOrdersChartComponent },
];
