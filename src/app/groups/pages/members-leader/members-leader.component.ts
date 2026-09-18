import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Component, OnInit} from '@angular/core';
import {ShortMember} from '@app/shared/model/short-member.entity';
import {GroupService} from '@app/groups/services/group.service';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-members-leader',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, MatCardModule, MatIconModule],
  template: `
    <div class="p-4 md:p-8 bg-white min-h-screen">
      <h2 class="text-xl md:text-2xl font-bold mb-6">Integrantes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <mat-card
          *ngFor="let member of members; let idx = index"
          class="rounded-2xl shadow-md bg-neutral-100 p-2 cursor-pointer w-full transition-transform hover:-translate-y-1"
          (click)="goToTaskDetails(member.id)"
        >
          <div class="flex flex-wrap items-center px-4 pt-4 pb-2 gap-3">
            <img [src]="member.imgUrl" alt="{{member.name}}" class="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 shadow object-cover" />
            <span class="font-semibold text-lg md:text-xl text-slate-800 break-words flex-1">{{ member.name }} {{ member.surname }}</span>
          </div>

          <ng-container *ngIf="member.task">
            <div class="rounded-xl shadow bg-[#1e4677] mt-3 mx-2 px-4 py-4 md:px-5 md:py-5 text-white">
              <div class="text-lg md:text-xl font-semibold mb-2 truncate">{{ member.task.title }}</div>
              <hr class="my-1 border-blue-400 border-opacity-60">
              <div class="text-sm md:text-base line-clamp-3">{{ member.task.description }}</div>
            </div>
            <div class="mt-4 mx-4 md:mx-6 h-3 rounded-full bg-gray-200 overflow-hidden">
              <div class="h-full w-full" [ngStyle]="{ background: getBarColor(member.task.status) }"></div>
            </div>
            <div class="text-sm md:text-base text-center tracking-wide mt-2 mb-2 text-gray-700 font-medium">
              {{ member.task.dueDate | date:'dd/MM/yyyy' }} - {{ member.task.createdAt | date:'dd/MM/yyyy' }}
            </div>
          </ng-container>

          <ng-container *ngIf="!member.task">
            <div class="rounded-xl shadow bg-gray-200 mt-4 mb-2 mx-2 px-4 py-4 text-gray-600 flex items-center justify-center min-h-[5rem]">
              Sin tareas
            </div>
          </ng-container>
        </mat-card>
      </div>

      <ng-template #noMembers>
        <p class="text-gray-700 text-lg">No hay integrantes para mostrar.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    mat-card { box-shadow: 0 8px 24px #0001; }
  `]
})
export class MembersLeaderComponent implements OnInit {
  members: (ShortMember & { // @ts-ignore
    task?: Task })[] = [];

  constructor(private groupService: GroupService, private router: Router) {}

  goToTaskDetails(memberId: number) {
    this.router.navigate([`/leaders/my-group/members/${memberId}/tasks`]);
  }

  ngOnInit() {
    const groupId = 1; // Ajusta a tu lógica o guarda el groupId que corresponda
    forkJoin({
      members: this.groupService.getGroupMembers(),
      tasks: this.groupService.getAllTasksByGroupId(groupId)
    }).subscribe({
      next: ({members, tasks}) => {
        this.members = members.map(member => ({
          ...member,
          task: tasks.find(task => task.member && task.member.id === member.id)
        }));
      },
      error: (error) => {
        console.error('Error al obtener integrantes o tareas', error);
      }
    });
  }

  getBarColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
      case 'IN_PROGRESS':
        return '#17c950'; // verde
      case 'EXPIRED':
        return '#ff3c3c'; // rojo
      case 'ON_HOLD':
      case 'PENDING':
        return '#ffe266'; // amarillo
      default:
        return '#c8c8c8';
    }
  }
}
