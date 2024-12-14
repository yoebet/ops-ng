import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@/models/sys/user';
import { UserService } from '@/services/sys/user.service';
import { ApiResult, ResultCodes } from '@/models/api-result';
import { validateForm } from '../../common/utils';


@Component({
  standalone: false,
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {
  hidePassword = true;
  form: FormGroup;

  user: User;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<UserEditComponent, User>,
              @Inject(MAT_DIALOG_DATA) public data: User) {
    this.user = data;
    this.form = this.fb.group({
      username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      password: [null],
      role: new FormControl(null),
      email: new FormControl(null)
    });
  }

  ngOnInit() {
    const patch = { ...this.user } as any;
    this.form.patchValue(patch);
  }


  save() {
    if (!this.user) {
      this.dialogRef.close();
      return;
    }
    if (!validateForm(this.form)) {
      return;
    }
    // Save
    const toSave = Object.assign({}, this.user, this.form.value);

    if (this.user.id) {
      delete toSave.createdAt;
      this.userService.update(toSave)
        .subscribe((opr: ApiResult) => {
          if (opr.code !== ResultCodes.CODE_SUCCESS) {
            this.userService.showError(opr);
            return;
          }
          Object.assign(this.user, toSave);
          this.dialogRef.close(this.user);
        });
    } else {
      const password = toSave.password;
      if (!password) {
        this.form.get('password').setErrors({ required: true });
        return;
      }
      if (password.length < 4) {
        this.form.get('password').setErrors({ minlength: true });
        return;
      }
      this.userService.create2(toSave)
        .subscribe((user: User) => {
          this.dialogRef.close(user);
        });

    }

  }
}
