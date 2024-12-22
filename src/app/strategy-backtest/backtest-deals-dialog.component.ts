import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StrategyDealSimple } from '@/models/strategy/strategy-deal-simple';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableDatasource } from '@/app/common/table-datasource';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';

@Component({
  standalone: false,
  selector: 'backtest-deals-dialog',
  templateUrl: './deals-dialog.component.html',
})
export class BacktestDealsDialogComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StrategyDealSimple>;

  dataSource: TableDatasource<StrategyDealSimple>;

  displayedColumns: (keyof StrategyDealSimple | 'index')[] = [
    'index',
    'status',
    'pendingOrderId',
    'lastOrderId',
    'pnlUsd',
    'createdAt',
    'closedAt',
  ]

  constructor(
    protected stService: BacktestStrategyService,
    @Inject(MAT_DIALOG_DATA) public strategy: BacktestStrategy) {
    if (strategy.deals) {
      this.dataSource.setData(strategy.deals);
    } else {
      stService.getDeals(strategy.id).subscribe(result => {
        strategy.deals = result.list;
        this.dataSource.setData(strategy.deals);
      });
    }
  }

  ngOnInit() {
    this.dataSource = new TableDatasource<StrategyDealSimple>();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }
}
