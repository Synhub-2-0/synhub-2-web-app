import {Component, inject} from '@angular/core';
import {InvitationListComponent} from '../../components/invitation-list/invitation-list.component';
import {InvitationsApiService} from '../../services/invitations-api.service';
import {Invitation} from '../../model/invitation.entity';

@Component({
  selector: 'app-invitations-leader',
  imports: [
    InvitationListComponent
  ],
  templateUrl: './invitations-leader.component.html',
  styleUrl: './invitations-leader.component.css'
})
export class InvitationsLeaderComponent {
  private invitationsApiService = inject(InvitationsApiService);
  invitations: Array<Invitation> = [];

  private getData() {
    this.invitationsApiService.fetchGroupInvitations().subscribe((response: Array<Invitation>) => {
      this.invitations = response;
      console.log('Invitations fetched successfully:', this.invitations);
    }, error => {
      console.error('There was an error fetching invitations!', error);
    });
  }


  ngOnInit(): void {
      this.getData();
    }
}
