import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { BaseService } from '../base.service';
import { Coin } from '@/models/ex/coin';
import { UnifiedSymbol } from '@/models/ex/unified-symbol';
import { ExchangeSymbol } from '@/models/ex/exchange-symbol';
import { Option } from '@/models/base';

@Injectable()
export class ExchangeService extends BaseService<any> {

  protected symbols: UnifiedSymbol[];
  protected $symbols: Observable<UnifiedSymbol[]>;

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/sys`;
  }

  getExchanges(): Option [] {
    return [{ value: 'binance', label: 'Binance' }, { value: 'okx', label: 'OKX' }];
  }

  listCoins(): Observable<Coin[]> {
    const url = `${this.baseUrl}/coins`;
    return super.list2(url);
  }

  listUnifiedSymbols(): Observable<UnifiedSymbol[]> {
    if (this.symbols) {
      return Rx.of(this.symbols);
    }
    if (this.$symbols) {
      return this.$symbols;
    }
    const url = `${this.baseUrl}/unified-symbols`;
    this.$symbols = super.list2(url)
      .pipe(Rx.tap((us) => {
        this.symbols = us;
        this.$symbols = undefined;
      }), Rx.share());
    return this.$symbols;
  }

  listExchangeSymbols(): Observable<ExchangeSymbol[]> {
    const url = `${this.baseUrl}/exchange-symbols`;
    return super.list2(url);
  }

}
