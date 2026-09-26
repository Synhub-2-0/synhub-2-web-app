import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InvitationListComponent } from '../../components/invitation-list/invitation-list.component';
import { InvitationsApiService } from '../../services/invitations-api.service';
import { Invitation } from '../../model/invitation.entity';
import { LeaderGroupService } from '@app/groups/services/leader-group.service';
import { Group } from '@app/groups/model/group.entity';

@Component({
  selector: 'app-invitations-leader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    InvitationListComponent
  ],
  templateUrl: './invitations-leader.component.html',
  styleUrl: './invitations-leader.component.css'
})
export class InvitationsLeaderComponent implements OnInit {
  private invitationsApiService = inject(InvitationsApiService);
  private leaderGroupService = inject(LeaderGroupService);

  loading = true;
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  invitations: Invitation[] = [];

  usernameToInvite = '';
  inviting = false;
  inviteMessage = '';
  inviteError = '';

  ngOnInit(): void {
    this.loadLeaderGroups();
  }

  loadLeaderGroups(): void {
    this.loading = true;
    this.leaderGroupService.getLeaderGroups().subscribe({
      next: (groups) => {
        this.groups = groups || [];
        if (this.groups.length > 0) {
          this.selectGroup(this.groups[0]);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.loadGroupInvitations();
  }

  loadGroupInvitations(): void {
    if (!this.selectedGroup) return;
    this.loading = true;
    this.invitationsApiService.fetchGroupInvitations(this.selectedGroup.id).subscribe({
      next: (response) => {
        this.invitations = response || [];
        this.loading = false;
      },
      error: () => {
        this.invitations = [];
        this.loading = false;
      }
    });
  }

  onInviteByUsername(): void {
    if (!this.selectedGroup || !this.usernameToInvite.trim()) return;

    this.inviting = true;
    this.inviteError = '';
    this.inviteMessage = '';

    const cleanUsername = this.usernameToInvite.replace('@', '').trim();

    this.invitationsApiService.inviteUserByUsername(cleanUsername, this.selectedGroup.id).subscribe({
      next: () => {
        this.inviting = false;
        this.usernameToInvite = '';
        this.inviteMessage = `Invitación enviada a @${cleanUsername}`;
        this.loadGroupInvitations();
      },
      error: () => {
        this.inviting = false;
        this.inviteError = 'No se pudo enviar la invitación. Verifica el nombre de usuario.';
      }
    });
  }
}
