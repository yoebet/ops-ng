import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Strategy } from '@/models/strategy/strategy';
import { StrategyService } from '@/services/strategy/strategy.service';
import { StrategyDealSimple } from '@/models/strategy/strategy-deal-simple';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableDatasource } from '@/app/common/table-datasource';

@Component({
  standalone: false,
  selector: 'strategy-deals-dialog',
  templateUrl: './deals-dialog.component.html',
})
export class StrategyDealsDialogComponent implements AfterViewInit, OnInit {
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
    protected stService: StrategyService,
    @Inject(MAT_DIALOG_DATA) public strategy: Strategy) {
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
