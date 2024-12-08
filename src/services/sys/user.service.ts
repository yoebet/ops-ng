import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '@/models/sys/user';
import { ModelCurdService } from '../model-curd.service';
import { ApiResult } from '@/models/api-result';


@Injectable()
export class UserService extends ModelCurdService<User> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/sys/users`;
  }


  resetPassword(username: string, newPassword: string): Observable<ApiResult> {
    const url = `${this.baseUrl}/resetPass`;
    const form = { username, newPassword };
    return super.pipeDefault(this.http.post<ApiResult>(url, form));
  }

}
