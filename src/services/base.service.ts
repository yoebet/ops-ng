import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '../environments/environment';
import { MessageDialogComponent } from '../app/common/message-dialog/message-dialog.component';
import { CountList, CountListResult, ListResult, ApiResult, ResultCodes, ValueResult } from '../models/api-result';

export class BaseService<M> {

  protected baseUrl = '';

  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    // super(dialog);
  }

  get apiBase(): string {
    return environment.apiBase;
  }


  /*  listForType<T>(url: string = null, params?: any): Observable<ListResult<T>> {
      url = url || this.baseUrl;
      return this.pipeDefault(this.http.get<ListResult<T>>(url, {params}));
    }*/

  list(url: string = null, params?: any): Observable<ListResult<M>> {
    url = url || this.baseUrl;
    return this.pipeDefault(this.http.get<ListResult<M>>(url, { params }));
  }

  list2(url: string = null, params?: any): Observable<M[]> {
    return this.list(url, params).pipe(map(this.unwrapListResult));
  }

  page(url: string = null, params?: any): Observable<CountListResult<M>> {
    url = url || `${this.baseUrl}/page`;
    return this.pipeDefault(this.http.get<CountListResult<M>>(url, { params }));
  }

  page2(url: string = null, params?: any): Observable<CountList<M>> {
    return this.page(url, params).pipe(map(this.unwrapCountListResult));
  }

  getOne(url: string, params = null): Observable<ValueResult<M>> {
    return this.pipeDefault(this.http.get<ValueResult<M>>(url, { params }));
  }

  getOne2(url: string, params = null): Observable<M> {
    return this.getOne(url, params).pipe(map(this.unwrapValueResult));
  }


  postForResult(url: string, form: M = null): Observable<ValueResult<M>> {
    return this.pipeDefault(this.http.post<ValueResult<M>>(url, form));
  }

  postForResult2(url: string, form: M = null): Observable<M> {
    return this.postForResult(url, form).pipe(map(this.unwrapValueResult));
  }

  postForList(url: string, form: M = null): Observable<ListResult<M>> {
    return this.pipeDefault(this.http.post<ListResult<M>>(url, form));
  }

  postForList2(url: string, form: M = null): Observable<M[]> {
    return this.postForList(url, form).pipe(map(this.unwrapListResult));
  }

  showError(opr: ApiResult) {
    if (!opr) {
      return;
    }
    if (opr.code === ResultCodes.CODE_SUCCESS) {
      return;
    }
    if (typeof opr.code === 'undefined') {
      return;
    }
    this.showErrorMessage(opr.message);
  }

  showErrorMessage(msg: string, title = '') {
    if (!msg) {
      msg = ResultCodes.GENERAL_FAILURE_MESSAGE;
    }
    const data = { msg, type: 'error', title };
    MessageDialogComponent.ShowMessageDialog(data, this.dialog);
  }

  showMessage(msg: string, title = '') {
    if (!msg) {
      return;
    }
    const data = { msg, type: 'info', title };
    MessageDialogComponent.ShowMessageDialog(data, this.dialog);
  }

  protected pipeDefault(obs: Observable<ApiResult>) {
    return obs.pipe(
      filter(this.filterCommonFailure),
      catchError(this.handleError));
  }

  protected unwrapValueResult = (result: ValueResult<M>) => this._unwrapValueResult(result);

  protected _unwrapValueResult(result: ValueResult<M>): M {
    if (result.code !== ResultCodes.CODE_SUCCESS) {
      this.showError(result);
      return null;
    }
    return result.value;
  }

  protected unwrapListResult = (result: ListResult<M>) => this._unwrapListResult(result);

  protected _unwrapListResult(result: ListResult<M>): M[] {
    if (result.code !== ResultCodes.CODE_SUCCESS) {
      this.showError(result);
      return [];
    }
    return result.list;
  }

  protected unwrapCountListResult = (result: CountListResult<M>) => this._unwrapCountListResult(result);

  protected _unwrapCountListResult(result: CountListResult<M>): CountList<M> {
    if (result.code !== ResultCodes.CODE_SUCCESS) {
      this.showError(result);
      return null;
    }
    return result.countList;
  }

  protected handleError = (err: any) => this._handleError(err);

  protected filterCommonFailure = (result: ApiResult) => this._filterCommonFailure(result);

  protected _filterCommonFailure(result: ApiResult) {

    if (!result) {
      this.showErrorMessage('未返回结果');
      return false;
    }
    if (typeof result.code === 'undefined') {
      // this.showErrorMessage(result.message);
      return false;
    }
    // if (result.code === ResultCodes.CODE_NOT_AUTHENTICATED) {
    //   this.openLoginDialog();
    //   return false;
    // }
    // if (result.code === ResultCodes.CODE_NOT_AUTHORIZED) {
    //   this.showErrorMessage(result.message || '无权限');
    //   return false;
    // }

    return true;
  }

  protected _handleError(error: any/*, caught*/): Observable<any> {
    console.error(error);
    if (error.name === 'HttpErrorResponse') {
      const httpError = error as HttpErrorResponse;

      // if (httpError.status === 401) {
      //   this.openLoginDialog();
      //   return EMPTY;
      // }

      if (httpError.error) {
        const result: ApiResult = httpError.error;
        if (result.message) {
          this.showErrorMessage(result.message);
          throw error;
        }
      }

      switch (httpError.status) {
        case 404:
          this.showErrorMessage('404 错误');
          break;
        case 500:
          this.showErrorMessage('服务器内部错误');
          break;
        case 0:
          this.showErrorMessage('发生错误了，请检查网络连接');
          break;
        default:
          this.showErrorMessage(httpError.message || '发生错误了');
      }
    }

    throw error;
  }
}
