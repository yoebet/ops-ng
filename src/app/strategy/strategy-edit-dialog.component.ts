import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsiderSide, OppCheckerAlgo, StrategyAlgo } from '@/models/strategy.types';
import { ExTradeType } from '@/models/ex/exchange-types';
import { Option, TradeSide } from '@/models/base';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Strategy } from '@/models/strategy/strategy';
import { StrategyService } from '@/services/strategy/strategy.service';
import { UnifiedSymbol } from '@/models/ex/unified-symbol';
import { ExchangeService } from '@/services/sys/exchange.service';

@Component({
  standalone: false,
  selector: 'strategy-edit-dialog',
  templateUrl: './strategy-edit-dialog.component.html',
})
export class StrategyEditDialogComponent {
  oppAlgos = Object.values(OppCheckerAlgo);
  sides: ConsiderSide[] = [TradeSide.buy, TradeSide.sell, 'both'];
  exchanges: Option[] = [];
  symbols: UnifiedSymbol[] = [];

  st: Strategy;
  paramsJson: string;

  constructor(
    protected stService: StrategyService,
    protected exchangeService: ExchangeService,
    protected snackBar: MatSnackBar,
    protected dialogRef: MatDialogRef<StrategyEditDialogComponent, Strategy>,
    @Inject(MAT_DIALOG_DATA)
    public data: { strategy?: Strategy, symbols: UnifiedSymbol[], paperTrade: boolean }) {

    const { strategy, symbols, paperTrade } = data;
    this.symbols = symbols;
    this.exchanges = exchangeService.getExchanges();
    this.st = new Strategy();
    const symbol0 = this.symbols[0]?.symbol;
    const ex0 = this.exchanges[0]?.value;
    if (strategy) {
      if (!strategy.ex) {
        strategy.ex = ex0;
      }
      if (!strategy.symbol) {
        strategy.symbol = symbol0;
      }
      if (typeof strategy.paperTrade !== 'boolean') {
        strategy.paperTrade = paperTrade;
      }
      Object.assign(this.st, strategy);
    } else {
      const sym = this.symbols[0];
      Object.assign(this.st, {
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
        paperTrade,
        params: {}
      } as Strategy);
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
    const ori = this.data.strategy;
    const usym = this.symbols.find(s => s.symbol === st.symbol);
    st.baseCoin = usym.base;
    st.market = usym.market;
    st.rawSymbol = undefined; // set at backend
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

  protected readonly ExTradeType = ExTradeType;
}
