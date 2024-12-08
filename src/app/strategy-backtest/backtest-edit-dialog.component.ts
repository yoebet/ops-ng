import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsiderSide, OppCheckerAlgo, StrategyAlgo } from '@/models/strategy.types';
import { ExTradeType } from '@/models/ex/exchange-types';
import { Option, TradeSide } from '@/models/base';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnifiedSymbol } from '@/models/ex/unified-symbol';
import { ExchangeService } from '@/services/sys/exchange.service';
import { BacktestStrategy } from '@/models/strategy/backtest-strategy';
import { BacktestStrategyService } from '@/services/strategy/backtest-strategy.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { extractDate, validateForm } from '@/app/common/utils';

@Component({
  standalone: false,
  selector: 'backtest-edit-dialog',
  templateUrl: './backtest-edit-dialog.component.html',
})
export class BacktestEditDialogComponent {
  readonly range = new FormGroup({
    start: new FormControl<string | null>(null, [Validators.required]),
    end: new FormControl<string | null>(null, [Validators.required]),
  });

  oppAlgos = Object.values(OppCheckerAlgo);
  sides: ConsiderSide[] = [TradeSide.buy, TradeSide.sell, 'both'];
  exchanges: Option[] = [];
  symbols: UnifiedSymbol[] = [];

  st: BacktestStrategy;
  paramsJson: string;
  protected readonly ExTradeType = ExTradeType;

  constructor(
    protected stService: BacktestStrategyService,
    protected exchangeService: ExchangeService,
    protected snackBar: MatSnackBar,
    protected dialogRef: MatDialogRef<BacktestEditDialogComponent, BacktestStrategy>,
    @Inject(MAT_DIALOG_DATA)
    public data: { strategy?: BacktestStrategy, symbols: UnifiedSymbol[] }) {

    const { strategy, symbols } = data;
    this.symbols = symbols;
    this.exchanges = exchangeService.getExchanges();
    this.st = new BacktestStrategy();
    const st = this.st;
    const symbol0 = this.symbols[0]?.symbol;
    const ex0 = this.exchanges[0]?.value;
    if (strategy) {
      if (!strategy.ex) {
        strategy.ex = ex0;
      }
      if (!strategy.symbol) {
        strategy.symbol = symbol0;
      }
      Object.assign(this.st, strategy);
      this.range.setValue({ start: st.dataFrom || null, end: st.dataTo || null });
    } else {
      Object.assign(st, {
        ex: ex0,
        symbol: symbol0,
        // baseCoin: sym?.base,
        // market: sym?.market,
        // rawSymbol: sym?.base,
        algoCode: StrategyAlgo.INT,
        openAlgo: OppCheckerAlgo.MV,
        closeAlgo: OppCheckerAlgo.MV,
        tradeType: ExTradeType.spot,
        openDealSide: 'both',
        quoteAmount: 100,
        active: true,
        params: {}
      } as BacktestStrategy);
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
    if (!validateForm(this.range)) {
      return;
    }
    const st = this.st;
    st.params = JSON.parse(this.paramsJson);
    const dateRange = this.range.value;
    st.dataFrom = extractDate(dateRange.start);
    st.dataTo = extractDate(dateRange.end);
    const ori = this.data.strategy;
    const usym = this.symbols.find(s => s.symbol === st.symbol);
    st.baseCoin = usym.base;
    st.market = usym.market;
    st.rawSymbol = undefined; // set at backend
    // st.userExAccountId = undefined;
    if (st.id) {
      this.stService.update(st).subscribe(result => {
        if (ori) {
          Object.assign(ori, st);
          this.dialogRef.close();
          this.snackBar.open('<update> success');
        }
      });
    } else {
      if (!st.name) {
        st.name = `${st.openAlgo}-${st.closeAlgo}/${st.baseCoin}`;
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
}
