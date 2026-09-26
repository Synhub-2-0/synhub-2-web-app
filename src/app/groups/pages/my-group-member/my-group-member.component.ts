import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NoGroupMemberDisplayComponent } from '@app/groups/components/no-group-member-display/no-group-member-display.component';
import { MemberGroupService } from '@app/groups/services/member-group.service';
import { Group, GroupUser, UserInGroup } from '@app/groups/model/group.entity';

@Component({
  selector: 'app-my-group-member',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NoGroupMemberDisplayComponent
  ],
  templateUrl: './my-group-member.component.html',
  styleUrl: './my-group-member.component.css'
})
export class MyGroupMemberComponent implements OnInit {
  hasGroup = false;
  loading = true;

  memberGroups: Group[] = [];
  selectedGroup!: Group;
  leader: GroupUser | null = null;
  members: UserInGroup[] = [];
  filteredMembers: UserInGroup[] = [];

  constructor(
    private memberGroupService: MemberGroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMemberGroups();
  }

  getMemberGroups(): void {
    this.loading = true;
    this.memberGroupService.getMemberGroups().subscribe({
      next: (groups) => {
        if (groups && groups.length > 0) {
          this.memberGroups = groups;
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

  selectGroup(group: Group): void {
    this.selectedGroup = group;
    const users = group.usersInGroup || [];

    const leaderEntry = users.find(u => u.roleInGroup === 'GROUP_LEADER');
    this.leader = leaderEntry ? leaderEntry.user : null;

    this.members = users.filter(u => u.roleInGroup === 'GROUP_MEMBER');
    this.filteredMembers = [...this.members];
  }

  onFilterMembers(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (!query) {
      this.filteredMembers = [...this.members];
      return;
    }
    this.filteredMembers = this.members.filter(m =>
      `${m.user.name} ${m.user.surname} ${m.user.username}`.toLowerCase().includes(query)
    );
  }

  goToMyTasks(): void {
    this.router.navigate(['members/my-group/tasks']).then();
  }

  goToMyRequests(): void {
    this.router.navigate(['members/my-group/request-&-validations']).then();
  }
}
