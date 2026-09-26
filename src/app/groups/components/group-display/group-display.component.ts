import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NoGroupDisplayComponent } from '../no-group-display/no-group-display.component';
import { LeaderGroupService } from '@app/groups/services/leader-group.service';
import { Group, UserInGroup } from '@app/groups/model/group.entity';
import { UpdateGroupRequest } from '@app/groups/model/requests/update-group.request';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-group-display',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NoGroupDisplayComponent,
    MatIconModule
  ],
  templateUrl: './group-display.component.html',
  styles: ``
})
export class GroupDisplayComponent implements OnInit {
  hasGroup = false;
  hasMembers = false;
  loading = true;

  groups: Group[] = [];
  group!: Group;
  members: UserInGroup[] = [];

  isEditing = false;
  editForm = {
    name: '',
    description: '',
    imgUrl: ''
  };

  constructor(
    private leaderGroupService: LeaderGroupService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLeaderGroups();
  }

  getLeaderGroups(): void {
    this.loading = true;
    this.leaderGroupService.getLeaderGroups().subscribe({
      next: (groups) => {
        if (groups && groups.length > 0) {
          this.groups = groups;
          this.selectGroup(groups[0]);
          this.hasGroup = true;
        } else {
          this.hasGroup = false;
        }
        this.loading = false;
      },
      error: () => {
        this.hasGroup = false;
        this.loading = false;
      }
    });
  }

  selectGroup(selected: Group): void {
    this.group = selected;
    this.isEditing = false;
    this.members = (selected.usersInGroup || []).filter(
      u => u.roleInGroup === 'GROUP_MEMBER'
    );
    this.hasMembers = this.members.length > 0;
  }

  startEdit(): void {
    this.editForm = {
      name: this.group.name,
      description: this.group.description,
      imgUrl: this.group.imgUrl
    };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveGroupChanges(): void {
    if (!this.editForm.name.trim() || !this.editForm.description.trim()) return;

    const request = new UpdateGroupRequest(
      this.editForm.name.trim(),
      this.editForm.imgUrl.trim(),
      this.editForm.description.trim()
    );

    this.leaderGroupService.updateLeaderGroup(this.group.id, request).subscribe({
      next: (updatedGroup) => {
        const index = this.groups.findIndex(g => g.id === updatedGroup.id);
        if (index !== -1) {
          this.groups[index] = updatedGroup;
        }
        this.selectGroup(updatedGroup);
      },
      error: (err) => console.error('Error actualizando el grupo', err)
    });
  }

  confirmDeleteGroup(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Grupo',
        description: `¿Estás seguro de que deseas eliminar el grupo "${this.group.name}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true' || result === true) {
        this.leaderGroupService.deleteGroup(this.group.id).subscribe({
          next: () => this.getLeaderGroups(),
          error: (err) => console.error('Error eliminando el grupo', err)
        });
      }
    });
  }

  goToCreateGroup(): void {
    this.router.navigate(['leaders/create-group']).then();
  }

  goToInvitations(): void {
    this.router.navigate(['leaders/my-group/invitations']).then();
  }

  goToMemberTasks(memberId: number): void {
    this.router.navigate([`leaders/my-group/members/${memberId}/tasks`]).then();
  }
}
