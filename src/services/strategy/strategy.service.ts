import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModelCurdService } from '../model-curd.service';
import { Strategy } from '@/models/strategy/strategy';
import { ApiResult, ListResult } from '@/models/api-result';
import { StrategyOrder } from '@/models/strategy/strategy-order';
import { StrategyDealSimple } from '@/models/strategy/strategy-deal-simple';


@Injectable()
export class StrategyService extends ModelCurdService<Strategy> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/strategies`;
  }

  getOrders(strategyId: number): Observable<ListResult<StrategyOrder>> {
    const url = `${this.baseUrl}/${strategyId}/orders`;
    return this.list0<StrategyOrder>(url);
  }

  getDeals(strategyId: number): Observable<ListResult<StrategyDealSimple>> {
    const url = `${this.baseUrl}/${strategyId}/deals`;
    return this.list0<StrategyDealSimple>(url);
  }

  operateJob(
    strategyId: number,
    op: 'summit' | 'remove' | 'stop' | 'retry' | 'clearLogs',
  ): Observable<ApiResult> {
    const url = `${this.baseUrl}/${strategyId}/job/${op}`;
    return this.post0(url);
  }

}
