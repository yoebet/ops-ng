import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Model } from '@/models/model';
import { ApiResult, ValueResult } from '@/models/api-result';
import { BaseService } from './base.service';

export class ModelCurdService<M extends Model> extends BaseService<M> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
  }

  getById(id: number): Observable<ValueResult<M>> {
    const url = `${this.baseUrl}/${id}`;
    return this.getOne(url);
  }

  getById2(id: number): Observable<M> {
    return this.getById(id).pipe(map(this.unwrapValueResult));
  }

  create(model: M): Observable<ValueResult<M>> {
    return this.postForResult(this.baseUrl, model);
  }

  create2(model: M): Observable<M> {
    return this.postForResult2(this.baseUrl, model);
  }

  remove(model: M | number): Observable<ApiResult> {
    const id = this.modelId(model);
    const url = `${this.baseUrl}/${id}`;
    return this.pipeDefault(this.http.delete<ApiResult>(url));
  }

  update(model: M): Observable<ApiResult> {
    const url = `${this.baseUrl}/${model.id}`;
    return this.pipeDefault(this.http.put<ApiResult>(url, model));
  }

  protected modelId(model: M | number): number {
    return typeof model === 'number' ? model : model.id;
  }

}
