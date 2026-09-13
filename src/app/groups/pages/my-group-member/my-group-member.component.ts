import { Component } from '@angular/core';
import {
  NoGroupMemberDisplayComponent
} from '@app/groups/components/no-group-member-display/no-group-member-display.component';
import {
  ProfileImageDisplayComponent
} from '@app/shared/components/profile-image-display/profile-image-display.component';
import {MatIconModule} from '@angular/material/icon';
import {MemberGroupService} from '@app/groups/services/member-group.service';
import {MemberGroup} from '@app/groups/model/member-group.entity';
import {ShortMember} from '@app/shared/model/short-member.entity';

@Component({
  selector: 'app-my-group-member',
  imports: [MatIconModule,
    ProfileImageDisplayComponent,
    NoGroupMemberDisplayComponent],
  templateUrl: './my-group-member.component.html',
  styleUrl: './my-group-member.component.css'
})
export class MyGroupMemberComponent {
  hasGroup = false;
  hasMembers = true;
  loading = true;
  members !: ShortMember[];
  group !: MemberGroup;

  constructor(private memberGroupService: MemberGroupService ) {
  }

  ngOnInit(){
    this.getMemberGroup();
  }

  getMemberGroup(){
    this.memberGroupService.getMemberGroup().subscribe({
      next: (memberGroup) => {
        this.group = memberGroup
        this.members = memberGroup.members;
        this.hasGroup = true;
        this.loading = false;
      },
      error: (err) => {
        this.hasGroup = false;
        this.loading = false;
      }
    })
  }
}
