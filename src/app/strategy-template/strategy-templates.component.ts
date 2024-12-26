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
import { ResultCodes } from '@/models/api-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StrategyTemplateEditDialogComponent } from '@/app/strategy-template/strategy-template-edit-dialog.component';

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
    'actions'
  ];

  processes: { [name: string]: boolean } = {};

  constructor(protected override sessionService: SessionService,
              protected stService: StrategyTemplateService,
              private snackBar: MatSnackBar,
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
    this.dataSource.setObservable(this.stService.list2());
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
    MessageDialogComponent.ShowMessageDialog(data, this.dialog, { disableClose: false, width: '480px' });
  }

  protected openEditDialog(st?: StrategyTemplate) {
    const ref = this.dialog.open(
      StrategyTemplateEditDialogComponent, {
        disableClose: true,
        width: '640px',
        maxWidth: '90vw',
        // maxHeight: '96vh',
        data: st,
      });
    ref.afterClosed().subscribe((result: StrategyTemplate) => {
      if (result) {
        // this.refresh();
        const list = this.dataSource.data;
        list.splice(0, 0, result);
        this.dataSource.setData(list);
      }
    });
  }

  edit(st?: StrategyTemplate) {
    if (st && st.id && !st.params) {
      this.stService.getById2(st.id)
        .subscribe((st2: StrategyTemplate) => {
          Object.assign(st, st2);
          this.openEditDialog(st);
        });
    } else {
      this.openEditDialog(st);
    }
  }

  duplicate(st: StrategyTemplate) {
    const editDuplicate = () => {
      const newSt = new StrategyTemplate();
      Object.assign(newSt, st);
      delete newSt.id;
      delete newSt.createdAt;
      this.edit(newSt);
    };
    if (!st.params) {
      this.stService.getById2(st.id)
        .subscribe((st2: StrategyTemplate) => {
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


  drop(st: StrategyTemplate) {
    if (!confirm('Are you sure?')) {
      return;
    }
    this.stService.remove(st.id).subscribe(result => {
      if (result.code === ResultCodes.CODE_SUCCESS) {
        this.snackBar.open(`remove success`);
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
