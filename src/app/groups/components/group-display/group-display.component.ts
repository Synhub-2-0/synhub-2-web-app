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
  template: `
    <div class="w-full h-full p-4 lg:p-0">
      @if (loading) {
        <div class="w-full h-full flex justify-center items-center">
          <mat-icon aria-hidden="false" aria-label="Cargando" fontIcon="cached" class="animate-spin"></mat-icon>
        </div>
      } @else {
        @if (hasGroup) {
          <div class="w-full h-auto lg:h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 min-h-0">
            <div class="w-full h-full flex flex-col gap-6 lg:gap-7">
              <h2 class="text-xl lg:text-2xl font-bold">Grupo</h2>

              <app-profile-image-display [groupName]="group.name" alt="Imagen del grupo" [imgSrc]="group.imgUrl"/>

              <div class="text-white flex justify-center items-center">
                <div class="bg-[#4A90E2] rounded-2xl py-2 px-6 text-lg lg:text-xl">
                  #{{ group.code }}
                </div>
              </div>
              <div class="w-full flex-1">
                <div class="w-full h-full rounded-3xl bg-[#1A4E85] p-6 lg:p-8 text-white text-center text-lg lg:text-xl flex items-center justify-center">
                  @if (group.description.length > 200) {
                    {{ group.description.slice(0, 200) + '...' }}
                  } @else {
                    {{ group.description }}
                  }
                </div>
              </div>
            </div>

            <div class="h-[400px] lg:h-full flex flex-col gap-6 lg:gap-7 min-h-0">
              <h2 class="text-xl lg:text-2xl font-bold">Miembros</h2>
              @if (hasMembers) {
                <div class="flex-1 rounded-3xl bg-[#F4F4F4] p-4 lg:p-8 text-black text-center text-xl min-h-0 flex flex-col">
                  <div class="bg-white rounded-2xl h-full flex-1 min-h-0">
                    <div class="flex flex-col p-4 gap-4 h-full overflow-y-auto">
                      @for (member of members; track member.id) {
                        <div class="flex justify-between items-center gap-2">
                          <div class="flex items-center min-w-0">
                            <img [src]="member.imgUrl" [alt]="member.name"
                                 class="aspect-square rounded-full w-10 lg:w-12 object-cover shadow-md shadow-gray-800 mr-3 lg:mr-4" />
                            <h3 class="text-sm lg:text-md font-medium text-left truncate">{{ member.name }}</h3>
                          </div>
                          <button
                            (click)="openDialog(member.name, member.id)"
                            class="bg-gray-300 flex items-center px-2 py-2 rounded hover:bg-red-400 transition-colors">
                            <mat-icon aria-hidden="false" aria-label="delete" fontIcon="delete" />
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              } @else {
                <div class="flex-1 w-full h-full rounded-3xl bg-[#1A4E85] p-6 lg:p-8 text-white text-center text-lg lg:text-xl flex items-center justify-center">
                  Tu grupo no tiene integrantes, bríndale el código a tus compañeros de proyecto para poder unirse.
                </div>
              }
            </div>
          </div>
        } @else {
          <h2 class="text-xl lg:text-2xl font-bold mb-4">Grupo</h2>
          <app-no-group-display/>
        }
      }
    </div>
  `,
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


  protected readonly Array = Array;
}
