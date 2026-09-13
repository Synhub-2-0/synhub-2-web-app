import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

type Data = { title: string; message: string; okText?: string; cancelText?: string };

@Component({
  selector: 'confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-delete-dialog.html'
})
export class ConfirmDeleteDialogComponent {
  constructor(
    private ref: MatDialogRef<ConfirmDeleteDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {}

  cancel() { this.ref.close(false); }
  ok() { this.ref.close(true); }
}
