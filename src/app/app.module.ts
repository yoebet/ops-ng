import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { MessageDialogComponent } from './common/message-dialog/message-dialog.component';
import { ServiceModule } from '../services/service.module';
import { KlineChartComponent } from './kline-chart/kline-chart.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppMaterialModule,
    // AppRoutingModule,
    ServiceModule
  ],
  declarations: [AppComponent, MessageDialogComponent, KlineChartComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}
