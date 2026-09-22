import { Component } from '@angular/core';
import {NoGroupDisplayComponent} from '../no-group-display/no-group-display.component';
import {
  ProfileImageDisplayComponent
} from '@app/shared/components/profile-image-display/profile-image-display.component';
import {MatIconModule} from '@angular/material/icon';
import {LeaderGroupService} from '@app/groups/services/leader-group.service';
import {Group} from '@app/groups/model/group.entity';
import {GroupService} from '@app/groups/services/group.service';
import {ShortMember} from '@app/shared/model/short-member.entity';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-group-display',
  imports: [
    NoGroupDisplayComponent,
    ProfileImageDisplayComponent,
    MatIconModule
  ],
  templateUrl: './group-display.component.html',
  styles: ``
})
export class GroupDisplayComponent {
  hasGroup = false;
  hasMembers = false;
  loading = true;
  members !: ShortMember[];
  group !: Group;

  constructor(private leaderGroupService: LeaderGroupService, private groupService:GroupService, private dialog : MatDialog) {

  }

  ngOnInit() {
    this.getLeaderGroup();
    this.getMembersOfGroup();
  }

  getLeaderGroup(){
    this.leaderGroupService.getLeaderGroup().subscribe({
      next: (group) => {
        this.group = group;
        this.hasGroup = true;
      },
      error: (err) => {
        this.hasGroup = false;
      }
    })
  }

  getMembersOfGroup(){
    this.groupService.getAllMembersOfGroup().subscribe({
      next: (members) => {
        this.members = members;
        this.hasMembers = members.length > 0;
        this.loading = false;
      },
      error: (err) => {
        this.hasMembers = false;
        this.loading = false;
      }
    })
  }

  deleteMember(memberId: number){
    this.leaderGroupService.deleteMemberFromGroup(memberId).subscribe({
      next: () => {
        this.members = this.members.filter(m => m.id !== memberId);
        this.hasMembers = this.members.length > 0;
      },
      error: (err) => {
        console.error('Error deleting member', err);
      }
    })
  }

  openDialog(memberName : string,memberId:number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Member',
        description: `Are you sure you want to delete ${memberName} from the group?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "true") {
        this.deleteMember(memberId);
      }
    });
  }
}
