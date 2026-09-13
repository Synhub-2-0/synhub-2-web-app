import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Invitation} from '../../model/invitation.entity';
import {InvitationComponent} from '../invitation/invitation.component';
import {InvitationsApiService} from '../../services/invitations-api.service';

@Component({
  selector: 'app-invitation-list',
  imports: [
    InvitationComponent
  ],
  templateUrl: './invitation-list.component.html',
  styleUrl: './invitation-list.component.css'
})
export class InvitationListComponent implements OnChanges{
  @Input() invitations: Array<Invitation> = [];

  constructor(private invitationsApi: InvitationsApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invitations']) {
      console.log("invitations on invitation list:", this.invitations);
    }
  }

  reloadInvitations() {
    this.invitationsApi.fetchGroupInvitations().subscribe({
      next: (invitations) => { this.invitations = invitations || []; }
    });
  }
}
