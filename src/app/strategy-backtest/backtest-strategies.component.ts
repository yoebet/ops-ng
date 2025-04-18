import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import _ from 'lodash';
import {SessionSupportComponent} from '@/app/common/session-support.component';
import {SessionService} from '@/services/sys/session.service';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {TableDatasource} from '@/app/common/table-datasource';
import {User} from '@/models/sys/user';
import {MessageDialogComponent} from '@/app/common/message-dialog/message-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {BacktestStrategyService} from '@/services/strategy/backtest-strategy.service';
import {BacktestStrategy} from '@/models/strategy/backtest-strategy';
import {BacktestOrdersChartDialogComponent} from '@/app/strategy-backtest/backtest-orders-chart-dialog.component';
import {ResultCodes} from '@/models/api-result';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StrategyDealsDialogComponent} from '@/app/strategy/strategy-deals-dialog.component';
import {UnifiedSymbol} from '@/models/ex/unified-symbol';
import {ExchangeService} from '@/services/sys/exchange.service';
import {BacktestEditDialogComponent} from '@/app/strategy-backtest/backtest-edit-dialog.component';
import {StrategyTemplate} from '@/models/strategy/strategy-template';
import {StrategyTemplateService} from '@/services/strategy/strategy-template.service';
import {
  StrategyTemplateSelectDialogComponent
} from '@/app/strategy-template/strategy-template-select-dialog.component';
import {Option} from '@/models/base';

@Component({
  standalone: false,
  selector: 'bt-strategies',
  templateUrl: './strategies.html',
})
export class BacktestStrategiesComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<BacktestStrategy>;

  dataSource: TableDatasource<BacktestStrategy>;
  symbols: UnifiedSymbol[] = [];
  templates: StrategyTemplate[] = [];

  exchanges: Option[] = [];
  coins: string[] = [];
  filter: {
    ex?: string;
    tradeType?: string;
    openDealSide?: string;
    baseCoin?: string;
  } = {};

  displayedColumns: (keyof BacktestStrategy | 'index' | 'actions' | 'algo')[] = [
    'index',
    // 'ex',
    'baseCoin',
    // 'symbol',
    // 'name',
    'algo',
    // 'openAlgo',
    // 'closeAlgo',
    'openDealSide',
    // 'tradeType',
    // 'quoteAmount',
    'dataFrom',
    'dataTo',
    'createdAt',
    'memo',
    // 'startedAt',
    // 'completedAt',
    'active',
    'jobSummited',
    'dealsCount',
    'ordersCount',
    'actions'
  ];

  processes: { [name: string]: boolean } = {};

  constructor(protected override sessionService: SessionService,
              protected stService: BacktestStrategyService,
              protected templateService: StrategyTemplateService,
              protected exchangeService: ExchangeService,
              private snackBar: MatSnackBar,
              protected dialog: MatDialog) {
    super(sessionService);
    exchangeService.listUnifiedSymbols().subscribe(us => {
      this.symbols = us;
      this.coins = _.uniq(us.map(s => s.base));
    });
    this.exchanges = exchangeService.getExchanges();
  }

  protected override onInit() {
    super.onInit();
    this.dataSource = new TableDatasource<BacktestStrategy>();
    this.dataSource.filter = (s: BacktestStrategy) => {
      const f = this.filter;
      if (!f) {
        return true;
      }
      if (f.ex && f.ex !== s.ex) {
        return false;
      }
      if (f.tradeType && f.tradeType !== s.tradeType) {
        return false;
      }
      if (f.openDealSide && f.openDealSide !== s.openDealSide) {
        return false;
      }
      if (f.baseCoin && f.baseCoin !== s.baseCoin) {
        return false;
      }
      return true;
    }
    this.dataSource.compareFieldMappers = {
      ordersCount: (s) => s.ordersCount,
      dealsCount: (s) => s.dealsCount,
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  refresh() {
    this.dataSource.setObservable(this.stService.list2())
  }

  applyFilter() {
    this.dataSource.refresh();
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

  protected override withSession(user: User) {
    // this.$exchs = this.exchService.list2();
    this.refresh();
  }

  private doShowParams(st: BacktestStrategy) {
    const msg = JSON.stringify(st.params, null, 2);
    const title = `Params（${st.name}）`;
    const data = {msg, type: '', title};
    MessageDialogComponent.ShowMessageDialog(data, this.dialog, {disableClose: false, width: '480px'});
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

  showDeals(st: BacktestStrategy) {
    this.dialog.open(
      StrategyDealsDialogComponent, {
        disableClose: true,
        width: '1280px',
        maxWidth: '90vw',
        // height: '90vh',
        // maxHeight: '96vh',
        data: {strategy: st, backtest: true},
      });
  }

  protected openEditDialog(st?: BacktestStrategy) {
    const ref = this.dialog.open(
      BacktestEditDialogComponent, {
        disableClose: true,
        width: '640px',
        maxWidth: '90vw',
        // maxHeight: '96vh',
        data: {
          strategy: st,
          symbols: this.symbols,
        },
      });
    ref.afterClosed().subscribe((result: BacktestStrategy) => {
      if (result) {
        // this.refresh();
        const list = this.dataSource.data;
        list.splice(0, 0, result);
        this.dataSource.setData(list);
      }
    });
  }

  edit(st?: BacktestStrategy) {
    if (st && st.id && !st.params) {
      this.stService.getById2(st.id).subscribe((st2: BacktestStrategy) => {
        Object.assign(st, st2);
        this.openEditDialog(st);
      });
    } else {
      this.openEditDialog(st);
    }
  }

  duplicate(st: BacktestStrategy) {
    const editDuplicate = () => {
      const newSt = new BacktestStrategy();
      Object.assign(newSt, st);
      delete newSt.id;
      delete newSt.createdAt;
      this.edit(newSt);
    };
    if (!st.params) {
      this.stService.getById2(st.id)
        .subscribe((st2: BacktestStrategy) => {
          Object.assign(st, st2);
          editDuplicate();
        });
    } else {
      editDuplicate();
    }
  }

  private createStrategyFromTemplate(
    st: StrategyTemplate,
  ) {
    const strategy = new BacktestStrategy();
    strategy.algoCode = st.code;
    strategy.openAlgo = st.openAlgo;
    strategy.closeAlgo = st.closeAlgo;
    strategy.openDealSide = st.openDealSide;
    strategy.tradeType = st.tradeType;
    strategy.quoteAmount = st.quoteAmount;
    strategy.active = true;
    strategy.params = st.params;
    return strategy;
  }

  protected openTemplateSelectDialog() {
    const ref = this.dialog.open(
      StrategyTemplateSelectDialogComponent, {
        disableClose: true,
        width: '800px',
        maxWidth: '90vw',
        // maxHeight: '96vh',
        data: {
          templates: this.templates,
        },
      });
    ref.afterClosed().subscribe((template: StrategyTemplate) => {
      if (!template) {
        return;
      }
      if (!template.params) {
        this.templateService.getById2(template.id)
          .subscribe((st2: StrategyTemplate) => {
            Object.assign(template, st2);
            const strategy = this.createStrategyFromTemplate(template);
            this.edit(strategy);
          });
      } else {
        const strategy = this.createStrategyFromTemplate(template);
        this.edit(strategy);
      }
    });
  }

  editNew() {
    // this.edit(undefined);
    if (this.templates.length > 0) {
      this.openTemplateSelectDialog();
      return;
    }
    this.templateService.list2().subscribe(templates => {
      this.templates = templates;
      this.openTemplateSelectDialog();
    });
  }

  operateJob(
    st: BacktestStrategy,
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
    st: BacktestStrategy,
  ) {
    const memo = st.memo ? (parseInt(st.memo) || 0) + 1 : 1;
    this.stService.clone(st.id, '' + memo).subscribe(result => {
      if (result.code === ResultCodes.CODE_SUCCESS) {
        this.snackBar.open(`clone success`);
        // this.refresh();
        const list = this.dataSource.data;
        list.splice(0, 0, result.value);
        this.dataSource.setData(list);
      } else {
        this.stService.showErrorMessage(result.message, 'clone');
      }
    });
  }

  cancelDeal(
    st: BacktestStrategy,
  ) {
    this.stService.cancelDeal(st.id).subscribe(result => {
      if (result.code === ResultCodes.CODE_SUCCESS) {
        this.snackBar.open(`success`);
      } else {
        this.stService.showErrorMessage(result.message, `Cancel Current Deal`);
      }
    });
  }

  drop(st: BacktestStrategy) {
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
