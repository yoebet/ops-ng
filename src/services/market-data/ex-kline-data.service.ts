import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Kline, KlineParams } from '@/models/kline';
import { BaseService } from '@/services/base.service';


@Injectable()
export class ExKlineDataService extends BaseService<Kline> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/ex-klines`;
  }

  query(params: KlineParams): Observable<Kline[]> {
    const url = `${this.baseUrl}/query`;
    return this.postForList2(url, params as any);
  }

}
