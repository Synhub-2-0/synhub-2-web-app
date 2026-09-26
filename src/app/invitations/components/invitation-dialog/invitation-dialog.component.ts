import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Invitation } from '../../model/invitation.entity';
import { InvitationsApiService } from '../../services/invitations-api.service';

@Component({
  selector: 'app-invitation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './invitation-dialog.component.html',
  styleUrl: './invitation-dialog.component.css'
})
export class InvitationDialogComponent {
  invitation: Invitation;
  loading = false;

  constructor(
    private invitationsApi: InvitationsApiService,
    @Inject(MAT_DIALOG_DATA) public data: { invitation: Invitation },
    private dialogRef: MatDialogRef<InvitationDialogComponent>
  ) {
    this.invitation = data.invitation;
  }

  onAcceptRequest(): void {
    this.loading = true;
    this.invitationsApi.acceptInvitation(this.invitation.id).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error aceptando invitación:', err);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
