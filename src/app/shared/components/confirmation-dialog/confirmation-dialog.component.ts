import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      {{data.description}}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton mat-dialog-close="false">No</button>
      <button matButton="filled"  mat-dialog-close="true" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
  `,
  styles: ``
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }) {}
}
