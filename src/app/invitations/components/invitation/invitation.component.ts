import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Invitation} from '../../model/invitation.entity';
import {DetailsService} from '../../../shared/services/details.service';
import {MatDialog} from '@angular/material/dialog';
import {InvitationDialogComponent} from '../invitation-dialog/invitation-dialog.component';

@Component({
  selector: 'app-invitation',
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  constructor(
    private detailsService: DetailsService,
    private dialog: MatDialog
  ) {
  }
  @Input() invitation!: Invitation;
  @Output() invitationChanged = new EventEmitter<void>();



  onRejectRequest() {
    this.detailsService.acceptOrDeclineInvitation(this.invitation.id, false)
      .subscribe({
        next: () => { this.invitationChanged.emit(); },
        error: err => { /* mostrar error */ }
      });
  }

  openDialog():void{
    const dialogRef = this.dialog.open(InvitationDialogComponent, {
      data: { invitation: this.invitation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invitationChanged.emit(); // Actualiza la lista si se aceptó la invitación
      }
    });
  }
}
