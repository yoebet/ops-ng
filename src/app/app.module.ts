import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { MessageDialogComponent } from './common/message-dialog/message-dialog.component';
import { ServiceModule } from '@/services/service.module';
import { KlineChartComponent } from './kline-chart/kline-chart.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ChangePwdComponent } from '@/app/sys/account/change-pwd.component';
import { LoginDialogComponent } from '@/app/sys/account/login-dialog.component';
import { HomeComponent } from '@/app/home/home.component';
import { UserDetailComponent } from '@/app/sys/user/user-detail.component';
import { UserEditComponent } from '@/app/sys/user/user-edit.component';
import { UserPwdResetComponent } from '@/app/sys/user/user-pwd-reset.component';
import { UsersComponent } from '@/app/sys/user/users.component';
import { ThemeSwitchComponent } from '@/app/home/theme-switch.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from '@/app/app.routes';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';
import { StrategiesComponent } from '@/app/strategy/strategies.component';
import { BacktestStrategiesComponent } from '@/app/strategy-backtest/backtest-strategies.component';
import { BacktestOrdersChartComponent } from '@/app/strategy-backtest/backtest-orders-chart.component';
import { BacktestOrdersChartDialogComponent } from '@/app/strategy-backtest/backtest-orders-chart-dialog.component';
import { StrategyOrdersChartComponent } from '@/app/strategy/strategy-orders-chart.component';
import { StrategyOrdersChartDialogComponent } from '@/app/strategy/strategy-orders-chart-dialog.component';
import { StrategyDealsDialogComponent } from '@/app/strategy/strategy-deals-dialog.component';
import { StrategyTemplateEditDialogComponent } from '@/app/strategy-template/strategy-template-edit-dialog.component';
import { StrategyEditDialogComponent } from '@/app/strategy/strategy-edit-dialog.component';
import { BacktestEditDialogComponent } from '@/app/strategy-backtest/backtest-edit-dialog.component';
import {
  StrategyTemplateSelectDialogComponent
} from '@/app/strategy-template/strategy-template-select-dialog.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppMaterialModule,
    ServiceModule,
    RouterOutlet,
    RouterModule.forRoot(routes, {
      // enableTracing: true,
      // useHash: true
    })
  ],
  declarations: [
    AppComponent, MessageDialogComponent,
    ChangePwdComponent, LoginDialogComponent, HomeComponent, ThemeSwitchComponent,
    UserDetailComponent, UserEditComponent, UserPwdResetComponent, UsersComponent,
    KlineChartComponent, StrategyTemplatesComponent, StrategyDealsDialogComponent,
    StrategiesComponent, StrategyOrdersChartComponent, StrategyOrdersChartDialogComponent,
    BacktestStrategiesComponent, BacktestOrdersChartComponent, BacktestOrdersChartDialogComponent,
    StrategyTemplateEditDialogComponent, StrategyEditDialogComponent, BacktestEditDialogComponent,
    StrategyTemplateSelectDialogComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync()
  ],
})
export class AppModule {
}
