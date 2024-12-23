import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strategy } from '@/models/strategy/strategy';
import { StrategyService } from '@/services/strategy/strategy.service';
import { StrategyDealSimple } from '@/models/strategy/strategy-deal-simple';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableDatasource } from '@/app/common/table-datasource';
import * as _ from 'lodash';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { Observable } from 'rxjs';
import { ListResult } from '@/models/api-result';

@Component({
  standalone: false,
  selector: 'strategy-deals-dialog',
  templateUrl: './deals-dialog.component.html',
})
export class StrategyDealsDialogComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StrategyDealSimple>;

  dataSource: TableDatasource<StrategyDealSimple>;
  pnl?: number;

  displayedColumns: (keyof StrategyDealSimple | 'index')[] = [
    'index',
    'status',
    'pendingOrderId',
    'lastOrderId',
    'pnlUsd',
    // 'createdAt',
    'openAt',
    'closedAt',
    'dealDuration',
    'closeReason',
    'ordersCount',
  ]

  constructor(
    protected stService: StrategyService,
    protected btService: BacktestStrategyService,
    @Inject(MAT_DIALOG_DATA) public data: { strategy: Strategy, backtest: boolean }) {
  }

  ngOnInit() {
    this.dataSource = new TableDatasource<StrategyDealSimple>();
    const { strategy, backtest } = this.data;

    const setDeals = () => {
      this.dataSource.setData(strategy.deals);
      this.pnl = _.sumBy(strategy.deals, 'pnlUsd');
    }
    if (strategy.deals) {
      setDeals();
    } else {
      let obs: Observable<ListResult<StrategyDealSimple>>;
      if (backtest) {
        obs = this.btService.getDeals(strategy.id);
      } else {
        obs = this.stService.getDeals(strategy.id)
      }
      obs.subscribe(result => {
        strategy.deals = result.list;
        setDeals();
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }
}
