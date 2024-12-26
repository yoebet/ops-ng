import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { BaseService } from '../base.service';
import { Coin } from '@/models/ex/coin';
import { UnifiedSymbol } from '@/models/ex/unified-symbol';
import { ExchangeSymbol } from '@/models/ex/exchange-symbol';

@Injectable()
export class ExchangeService extends BaseService<any> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/sys`;
  }

  listCoins(): Observable<Coin[]> {
    const url = `${this.baseUrl}/coins`;
    return super.list2(url);
  }

  listUnifiedSymbols(): Observable<UnifiedSymbol[]> {
    const url = `${this.baseUrl}/unified-symbols`;
    return super.list2(url);
  }

  listExchangeSymbols(): Observable<ExchangeSymbol[]> {
    const url = `${this.baseUrl}/exchange-symbols`;
    return super.list2(url);
  }

}
