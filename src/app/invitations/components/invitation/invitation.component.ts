import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Invitation } from '../../model/invitation.entity';
import { InvitationsApiService } from '../../services/invitations-api.service';
import { InvitationDialogComponent } from '../invitation-dialog/invitation-dialog.component';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  @Input() invitation!: Invitation;
  @Output() invitationChanged = new EventEmitter<void>();

  processing = false;

  constructor(
    private invitationsApi: InvitationsApiService,
    private dialog: MatDialog
  ) {}

  onRejectRequest(): void {
    this.processing = true;
    this.invitationsApi.cancelInvitation(this.invitation.id).subscribe({
      next: () => {
        this.processing = false;
        this.invitationChanged.emit();
      },
      error: (err) => {
        this.processing = false;
        console.error('Error al rechazar la invitación', err);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InvitationDialogComponent, {
      data: { invitation: this.invitation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invitationChanged.emit();
      }
    });
  }
}
