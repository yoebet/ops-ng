import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SessionSupportComponent } from '@/app/common/session-support.component';
import { SessionService } from '@/services/sys/session.service';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableDatasource } from '@/app/common/table-datasource';
import { User } from '@/models/sys/user';
import { MessageDialogComponent } from '@/app/common/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';
import { BacktestOrdersChartDialogComponent } from '@/app/strategy-backtest/backtest-orders-chart-dialog.component';

@Component({
  standalone: false,
  selector: 'bt-strategies',
  templateUrl: './strategies.html',
  styleUrls: ['./strategies.css']
})
export class BacktestStrategiesComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<BacktestStrategy>;

  dataSource: TableDatasource<BacktestStrategy>;

  displayedColumns: (keyof BacktestStrategy | 'index' | 'actions')[] = [
    'index',
    // 'ex',
    'symbol',
    // 'name',
    'openAlgo',
    'closeAlgo',
    'openDealSide',
    // 'tradeType',
    'quoteAmount',
    'dataFrom',
    'dataTo',
    'startedAt',
    'completedAt',
    'active',
    'jobSummited',
    'dealsCount',
    'ordersCount',
    'actions'
  ];

  processes: { [name: string]: boolean } = {};

  constructor(protected override sessionService: SessionService,
              protected stService: BacktestStrategyService,
              protected dialog: MatDialog) {
    super(sessionService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  refresh() {
    this.dataSource.setObservable(this.stService.list2())
  }

  showParams(st: BacktestStrategy) {
    if (st.params) {
      this.doShowParams(st);
      return;
    }
    this.stService.getById2(st.id)
      .subscribe((st2: BacktestStrategy) => {
        Object.assign(st, st2);
        this.doShowParams(st);
      });
  }

  editNew() {

  }

  protected override onInit() {
    super.onInit();
    this.dataSource = new TableDatasource<BacktestStrategy>();
  }

  protected override withSession(user: User) {
    // this.$exchs = this.exchService.list2();
    this.refresh();
  }

  private doShowParams(st: BacktestStrategy) {
    const msg = JSON.stringify(st.params, null, 2);
    const title = `Params（${st.name}）`;
    const data = { msg, type: '', title };
    MessageDialogComponent.ShowMessageDialog(data, this.dialog, { disableClose: false, width: '480px' });
  }

  showKlineOrdersChart(st: BacktestStrategy) {
    this.dialog.open(
      BacktestOrdersChartDialogComponent, {
        disableClose: true,
        width: '1280px',
        maxWidth: '90vw',
        // height: '90vh',
        // maxHeight: '96vh',
        data: st,
      });
  }
}
