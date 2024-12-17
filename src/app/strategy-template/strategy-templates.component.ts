import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SessionSupportComponent } from '@/app/common/session-support.component';
import { SessionService } from '@/services/sys/session.service';
import { StrategyTemplate } from '@/models/strategy/strategy-template';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableDatasource } from '@/app/common/table-datasource';
import { User } from '@/models/sys/user';
import { StrategyTemplateService } from '@/services/strategy/strategy-template.service';
import { MessageDialogComponent } from '@/app/common/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'strategy-templates',
  templateUrl: './strategy-templates.html',
  styleUrls: ['./strategy-templates.css']
})
export class StrategyTemplatesComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StrategyTemplate>;

  dataSource: TableDatasource<StrategyTemplate>;

  displayedColumns = [
    'index',
    'name',
    'code',
    'openAlgo',
    'closeAlgo',
    'openDealSide',
    'tradeType',
    'quoteAmount',
    'actions'
  ];

  templates: StrategyTemplate[];

  processes: { [name: string]: boolean } = {};

  constructor(protected override sessionService: SessionService,
              protected stService: StrategyTemplateService,
              protected dialog: MatDialog) {
    super(sessionService);
  }

  protected override onInit() {
    super.onInit();
    this.dataSource = new TableDatasource<StrategyTemplate>();
  }

  protected override withSession(user: User) {
    // this.$exchs = this.exchService.list2();
    this.refresh();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }


  refresh() {
    this.stService.list().subscribe(lr => {
      this.templates = lr.list;
      this.dataSource.setData(this.templates);
    });
  }


  showParams(st: StrategyTemplate) {
    if (st.params) {
      this.doShowParams(st);
      return;
    }
    this.stService.getById2(st.id)
      .subscribe((st2: StrategyTemplate) => {
        Object.assign(st, st2);
        this.doShowParams(st);
      });
  }

  private doShowParams(st: StrategyTemplate) {
    const msg = JSON.stringify(st.params, null, 2);
    const title = `Params（${st.name}）`;
    const data = { msg, type: '', title };
    MessageDialogComponent.ShowMessageDialog(data, this.dialog, { disableClose: false });
  }

  editNew() {

  }
}
