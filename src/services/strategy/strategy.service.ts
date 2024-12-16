import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ModelCurdService } from '../model-curd.service';
import { Strategy } from '@/models/strategy/strategy';
import { Observable } from 'rxjs';
import { ListResult } from '@/models/api-result';
import { StrategyOrder } from '@/models/strategy/strategy-order';


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

}
