import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogComponentData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?:'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogComponentData
  ){
    this.data.confirmText = data.confirmText || 'Confirm';
    this.data.cancelText = data.cancelText || 'Cancel';
    this.data.type = data.type || 'danger';
  }

  onCancel(){
    this.dialogRef.close(false);
  }

  onCanfirm(){
    this.dialogRef.close(true);
  }

}
