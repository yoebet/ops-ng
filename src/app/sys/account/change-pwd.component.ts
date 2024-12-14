import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileService } from '@/services/sys/user-profile.service';
import { ApiResult, ResultCodes } from '@/models/api-result';
import { User } from '@/models/sys/user';
import { validateForm } from '../../common/utils';

@Component({
  standalone: false,
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent {

  form: FormGroup;

  hidePassword = true;
  user: User;

  constructor(private fb: FormBuilder,
              protected userProfileService: UserProfileService,
              public dialogRef: MatDialogRef<ChangePwdComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data.user;
    this.form = this.fb.group({
      accountName: [null],
      oriPassword: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(4),
        (field) => this.pwdValidator(field)
      ]),
    });
    this.form.patchValue(data.user);
  }

  private pwdValidator(pwdConfirmField) {
    if (!this.form) {
      return null;
    }
    if (!pwdConfirmField.value) {
      return null;
    }
    const passwordFiled = this.form.get('newPassword');
    const newPwd = passwordFiled.value;
    if (newPwd !== pwdConfirmField.value) {
      return { pattern: true };
    }
    return null;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (!validateForm(this.form)) {
      return;
    }

    const values = { ...this.form.value };

    this.userProfileService.resetPassword(values.oriPassword, values.newPassword)
      .subscribe((result: ApiResult) => {
        if (!result || result.code !== ResultCodes.CODE_SUCCESS) {
          this.userProfileService.showError(result);
          return;
        }
        this.snackBar.open('密码修改成功');
        this.dialogRef.close();
      });
  }
}
