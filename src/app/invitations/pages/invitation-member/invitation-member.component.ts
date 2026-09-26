import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { InvitationsApiService } from '../../services/invitations-api.service';
import { Invitation } from '../../model/invitation.entity';
import { Group } from '@app/groups/model/group.entity';
import { GroupService } from '@app/groups/services/group.service';
import { MemberGroupService } from '@app/groups/services/member-group.service';

@Component({
  selector: 'app-invitation-member',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './invitation-member.component.html',
  styleUrl: './invitation-member.component.css'
})
export class InvitationMemberComponent implements OnInit {
  searchForm: FormGroup;
  loading = true;

  groupFound: Group | null = null;
  searchError: string | null = null;
  activeInvitations: Invitation[] = [];

  constructor(
    private fb: FormBuilder,
    private invitationsApi: InvitationsApiService,
    private groupsApi: GroupService,
    private memberGroupService: MemberGroupService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.checkActiveInvitations();
  }

  checkActiveInvitations(): void {
    this.loading = true;
    this.invitationsApi.getInvitationsByUser().subscribe({
      next: (invitations) => {
        this.activeInvitations = invitations || [];
        this.loading = false;
      },
      error: () => {
        this.activeInvitations = [];
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const rawCode = (this.searchForm.value.query || '').replace('#', '').trim();
    if (!rawCode) return;

    this.groupsApi.searchGroupByCode(rawCode).subscribe({
      next: (group) => {
        this.groupFound = group;
        this.searchError = null;
      },
      error: () => {
        this.groupFound = null;
        this.searchError = 'No se encontró ningún grupo con ese código.';
      }
    });
  }

  onJoinGroup(): void {
    if (!this.groupFound) return;
    this.invitationsApi.sendInvitationToGroup(this.groupFound.id).subscribe({
      next: () => {
        this.groupFound = null;
        this.checkActiveInvitations();
      },
      error: (err) => {
        console.error('Error al enviar solicitud de ingreso:', err);
      }
    });
  }

  onAcceptInvitation(invitationId: number): void {
    this.invitationsApi.acceptInvitation(invitationId).subscribe({
      next: () => {
        this.router.navigate(['/members/my-group']).then();
      },
      error: (err) => {
        console.error('Error al aceptar invitación:', err);
      }
    });
  }

  onCancelInvitation(invitationId: number): void {
    this.invitationsApi.cancelInvitation(invitationId).subscribe({
      next: () => {
        this.activeInvitations = this.activeInvitations.filter(i => i.id !== invitationId);
      },
      error: (err) => {
        console.error('Error al cancelar invitación:', err);
      }
    });
  }

  onCheckInvitationStatus(): void {
    this.memberGroupService.getMemberGroups().subscribe({
      next: (groups) => {
        if (groups && groups.length > 0) {
          this.router.navigate(['/members/my-group']).then();
        } else {
          this.checkActiveInvitations();
        }
      },
      error: () => {
        this.checkActiveInvitations();
      }
    });
  }
}
