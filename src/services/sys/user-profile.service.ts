import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '@/models/sys/user';
import { ApiResult } from '@/models/api-result';
import { BaseService } from '../base.service';


@Injectable()
export class UserProfileService extends BaseService<User> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/sys/user-profile`;
  }

  resetPassword(password: string, newPassword: string): Observable<ApiResult> {
    const url = `${this.baseUrl}/resetPass`;
    const form = { password, newPassword };
    return super.pipeDefault(this.http.post<ApiResult>(url, form));
  }

}
