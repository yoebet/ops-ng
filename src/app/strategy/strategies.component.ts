import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SessionSupportComponent } from '@/app/common/session-support.component';
import { SessionService } from '@/services/sys/session.service';
import { Strategy } from '@/models/strategy/strategy';
import { TableDatasource } from '@/app/common/table-datasource';
import { User } from '@/models/sys/user';
import { StrategyService } from '@/services/strategy/strategy.service';
import { MessageDialogComponent } from '@/app/common/message-dialog/message-dialog.component';
import { StrategyOrdersChartDialogComponent } from '@/app/strategy/strategy-orders-chart-dialog.component';

@Component({
  standalone: false,
  selector: 'strategies',
  templateUrl: './strategies.html',
  styleUrls: ['./strategies.css']
})
export class StrategiesComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Strategy>;

  type?: 'paper' | 'real';

  dataSource: TableDatasource<Strategy>;

  displayedColumns: (keyof Strategy | 'index' | 'actions')[] = [
    'index',
    'ex',
    // 'market',
    // 'baseCoin',
    'symbol',
    // 'rawSymbol',
    'name',
    'openAlgo',
    'closeAlgo',
    'openDealSide',
    'tradeType',
    'quoteAmount',
    // 'paperTrade',
    'active',
    'jobSummited',
    'dealsCount',
    'ordersCount',
    'actions'
  ];

  processes: { [name: string]: boolean } = {};

  constructor(protected override sessionService: SessionService,
              protected stService: StrategyService,
              private activatedRoute: ActivatedRoute,
              protected dialog: MatDialog) {
    super(sessionService);
    activatedRoute.data.subscribe(rd => {
      this.type = rd['type'];
    });
  }

  protected override onInit() {
    super.onInit();
    this.dataSource = new TableDatasource<Strategy>();
  }

  protected override withSession(user: User) {
    // this.$exchs = this.exchService.list2();
    this.refresh();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }


  refresh() {
    this.dataSource.setObservable(this.stService.list2(null, { type: this.type }));
  }


  showParams(st: Strategy) {
    if (st.params) {
      this.doShowParams(st);
      return;
    }
    this.stService.getById2(st.id)
      .subscribe((st2: Strategy) => {
        Object.assign(st, st2);
        this.doShowParams(st);
      });
  }

  private doShowParams(st: Strategy) {
    const msg = JSON.stringify(st.params, null, 2);
    const title = `Params（${st.name}）`;
    const data = { msg, type: '', title };
    MessageDialogComponent.ShowMessageDialog(data, this.dialog, { disableClose: false, width: '480px' });
  }

  showKlineOrdersChart(st: Strategy) {
    this.dialog.open(
      StrategyOrdersChartDialogComponent, {
        disableClose: true,
        width: '1280px',
        maxWidth: '90vw',
        // height: '90vh',
        // maxHeight: '96vh',
        data: st,
      });
  }

  editNew() {

  }
}
