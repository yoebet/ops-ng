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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResultCodes } from '@/models/api-result';
import { StrategyDealsDialogComponent } from '@/app/strategy/strategy-deals-dialog.component';
import { UnifiedSymbol } from '@/models/ex/unified-symbol';
import { ExchangeService } from '@/services/sys/exchange.service';
import { StrategyEditDialogComponent } from '@/app/strategy/strategy-edit-dialog.component';

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

  dataSource: TableDatasource<Strategy>;

  type?: 'paper' | 'real';
  symbols: UnifiedSymbol[] = [];

  displayedColumns: (keyof Strategy | 'index' | 'actions' | 'algo')[] = [
    'index',
    'ex',
    // 'market',
    // 'baseCoin',
    'symbol',
    // 'rawSymbol',
    'name',
    'algo',
    // 'openAlgo',
    // 'closeAlgo',
    'openDealSide',
    'tradeType',
    // 'quoteAmount',
    // 'paperTrade',
    'createdAt',
    'memo',
    'active',
    'jobSummited',
    'dealsCount',
    'ordersCount',
    'actions'
  ];

  processes: { [name: string]: boolean } = {};

  constructor(protected override sessionService: SessionService,
              protected stService: StrategyService,
              protected exchangeService: ExchangeService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              protected dialog: MatDialog) {
    super(sessionService);
    activatedRoute.data.subscribe(rd => {
      this.type = rd['type'];
    });
    exchangeService.listUnifiedSymbols().subscribe(us => {
      this.symbols = us;
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

  showDeals(st: Strategy) {
    this.dialog.open(
      StrategyDealsDialogComponent, {
        disableClose: true,
        width: '1280px',
        maxWidth: '90vw',
        // height: '90vh',
        // maxHeight: '96vh',
        data: { strategy: st, backtest: false },
      });
  }

  protected openEditDialog(st?: Strategy) {
    const ref = this.dialog.open(
      StrategyEditDialogComponent, {
        disableClose: true,
        width: '640px',
        maxWidth: '90vw',
        // maxHeight: '96vh',
        data: {
          strategy: st,
          symbols: this.symbols,
          paperTrade: this.type === 'paper',
        },
      });
    ref.afterClosed().subscribe((result: Strategy) => {
      if (result) {
        // this.refresh();
        const list = this.dataSource.data;
        list.splice(0, 0, result);
        this.dataSource.setData(list);
      }
    });
  }

  edit(st?: Strategy) {
    if (st && st.id && !st.params) {
      this.stService.getById2(st.id).subscribe((st2: Strategy) => {
        Object.assign(st, st2);
        this.openEditDialog(st);
      });
    } else {
      this.openEditDialog(st);
    }
  }

  duplicate(st: Strategy) {
    const editDuplicate = () => {
      const newSt = new Strategy();
      Object.assign(newSt, st);
      delete newSt.id;
      delete newSt.createdAt;
      this.edit(newSt);
    };
    if (!st.params) {
      this.stService.getById2(st.id)
        .subscribe((st2: Strategy) => {
          Object.assign(st, st2);
          editDuplicate();
        });
    } else {
      editDuplicate();
    }
  }

  editNew() {
    this.edit(undefined);
  }

  operateJob(
    st: Strategy,
    op: 'summit' | 'remove' | 'stop' | 'retry' | 'clearLogs',
  ) {
    this.stService.operateJob(st.id, op).subscribe(result => {
      if (result.code === ResultCodes.CODE_SUCCESS) {
        this.snackBar.open(`<${op}> success`);
      } else {
        this.stService.showErrorMessage(result.message, op);
      }
    });
  }

  clone(
    st: Strategy,
  ) {
    const memo = st.memo ? (parseInt(st.memo) || 0) + 1 : 1;
    this.stService.clone(st.id, '' + memo).subscribe(result => {
      if (result.code === ResultCodes.CODE_SUCCESS) {
        this.snackBar.open(`<clone> success`);
        // this.refresh();
        const list = this.dataSource.data;
        list.splice(0, 0, result.value);
        this.dataSource.setData(list);
      } else {
        this.stService.showErrorMessage(result.message, 'clone');
      }
    });
  }

  drop(st: Strategy) {
    if (!confirm('Are you sure?')) {
      return;
    }
    this.stService.remove(st.id).subscribe(result => {
      if (result.code === ResultCodes.CODE_SUCCESS) {
        this.snackBar.open(`<remove> success`);
        // this.refresh();
        let list = this.dataSource.data;
        list = list.filter(s => s !== st);
        this.dataSource.setData(list);
      } else {
        this.stService.showErrorMessage(result.message, 'remove');
      }
    });
  }
}
