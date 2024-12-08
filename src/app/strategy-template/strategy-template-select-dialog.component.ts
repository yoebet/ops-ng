import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { StrategyTemplate } from '@/models/strategy/strategy-template';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableDatasource } from '@/app/common/table-datasource';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'strategy-template-select-dialog',
  templateUrl: './strategy-template-select-dialog.component.html',
})
export class StrategyTemplateSelectDialogComponent implements AfterViewInit, OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StrategyTemplate>;

  dataSource: TableDatasource<StrategyTemplate>;

  displayedColumns: (keyof StrategyTemplate | 'index' | 'actions' | 'algo')[] = [
    'index',
    // 'name',
    // 'code',
    'algo',
    // 'openAlgo',
    // 'closeAlgo',
    'openDealSide',
    'tradeType',
    'quoteAmount',
    'createdAt',
    'memo',
  ];

  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<StrategyTemplateSelectDialogComponent, StrategyTemplate>,
              @Inject(MAT_DIALOG_DATA)
              public data: { templates: StrategyTemplate[] }) {
  }

  ngOnInit() {
    this.dataSource = new TableDatasource<StrategyTemplate>();
    this.dataSource.setData(this.data.templates);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  select(st: StrategyTemplate) {
    this.dialogRef.close(st);
  }

}
