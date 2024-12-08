import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrategyTemplateService } from '@/services/strategy/strategy-template.service';
import { StrategyTemplate } from '@/models/strategy/strategy-template';
import { OppCheckerAlgo, StrategyAlgo, ConsiderSide } from '@/models/strategy.types';
import { ExTradeType } from '@/models/ex/exchange-types';
import { TradeSide } from '@/models/base';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StrategyTemplatesComponent } from '@/app/strategy-template/strategy-templates.component';

@Component({
  standalone: false,
  selector: 'strategy-template-edit-dialog',
  templateUrl: './strategy-template-edit-dialog.component.html',
})
export class StrategyTemplateEditDialogComponent {

  oppAlgos = Object.values(OppCheckerAlgo);
  sides: ConsiderSide[] = [TradeSide.buy, TradeSide.sell, 'both'];

  st: StrategyTemplate;
  paramsJson: string;

  constructor(
    protected stService: StrategyTemplateService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<StrategyTemplatesComponent, StrategyTemplate>,
    @Inject(MAT_DIALOG_DATA) public data?: StrategyTemplate) {
    this.st = new StrategyTemplate();
    if (data) {
      Object.assign(this.st, data);
    } else {
      Object.assign(this.st, {
        code: StrategyAlgo.INT,
        openAlgo: OppCheckerAlgo.MV,
        closeAlgo: OppCheckerAlgo.MV,
        tradeType: ExTradeType.spot,
        openDealSide: 'both',
        quoteAmount: 100,
        params: {}
      } as StrategyTemplate);
    }
    this.paramsJson = JSON.stringify(this.st.params || {}, null, 2);
  }

  get isNew() {
    return !this.st?.id;
  }

  checkParams() {
    try {
      JSON.parse(this.paramsJson);
    } catch (error) {
      this.snackBar.open(error.message, 'Error', { duration: 2000 });
      console.error(error);
    }
  }

  save() {
    const st = this.st;
    st.params = JSON.parse(this.paramsJson);
    if (st.id) {
      this.stService.update(st).subscribe(result => {
        if (this.data) {
          Object.assign(this.data, st);
          this.dialogRef.close();
          this.snackBar.open('<update> success');
        }
      });
    } else {
      if (!st.name) {
        st.name = `${st.openAlgo}-${st.closeAlgo}`;
      }
      this.stService.create(st).subscribe(result => {
        if (result.value) {
          Object.assign(st, result.value);
          this.dialogRef.close(result.value);
          this.snackBar.open('<create> success');
        }
      });
    }
  }

  protected readonly ExTradeType = ExTradeType;
}
