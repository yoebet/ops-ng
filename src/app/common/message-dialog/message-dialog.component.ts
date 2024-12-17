import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: false,
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {

  title: string;
  msg: string;
  type: 'error' | 'info' | '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.type = data.type;
    this.msg = data.msg;
    if (!this.msg && this.type === 'error') {
      this.msg = '出错了';
    }
  }

  static ShowMessageDialog(data: any, dialog: MatDialog, config?: MatDialogConfig) {
    return dialog.open(
      MessageDialogComponent, {
        disableClose: true,
        width: '380px',
        maxWidth: '90vw',
        data,
        ...config,
      });
  }

}
