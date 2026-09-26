import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Invitation } from '../../model/invitation.entity';
import { InvitationComponent } from '../invitation/invitation.component';

@Component({
  selector: 'app-invitation-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, InvitationComponent],
  templateUrl: './invitation-list.component.html',
  styleUrl: './invitation-list.component.css'
})
export class InvitationListComponent {
  @Input() invitations: Invitation[] = [];
  @Output() invitationChanged = new EventEmitter<void>();

  onInvitationUpdated(): void {
    this.invitationChanged.emit();
  }
}
