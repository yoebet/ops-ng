import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {ModelCurdService} from '../model-curd.service';
import {Observable} from 'rxjs';
import {ApiResult, ListResult, ValueResult} from '@/models/api-result';
import {StrategyOrder} from '@/models/strategy/strategy-order';
import {BacktestStrategy} from '@/models/strategy/backtest-strategy';
import {StrategyDealSimple} from '@/models/strategy/strategy-deal-simple';


@Injectable()
export class BacktestStrategyService extends ModelCurdService<BacktestStrategy> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/bt-strategies`;
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

  clone(
    strategyId: number,
    memo: string,
  ): Observable<ValueResult<BacktestStrategy>> {
    const url = `${this.baseUrl}/${strategyId}/clone`;
    return this.postForResult(url, {memo} as any);
  }

  cancelDeal(strategyId: number): Observable<ValueResult<ApiResult>> {
    const url = `${this.baseUrl}/${strategyId}/cancel-current-deal`;
    return this.post0(url);
  }

}
