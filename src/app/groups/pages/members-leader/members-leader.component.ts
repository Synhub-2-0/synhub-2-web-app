import {CommonModule, NgOptimizedImage} from '@angular/common';
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
  imports: [CommonModule, MatCardModule, MatIconModule, NgOptimizedImage],
  templateUrl: './members-leader.component.html',
  styles: [`
    mat-card { box-shadow: 0 8px 24px #0001; }
  `]
})
export class MembersLeaderComponent implements OnInit {
  members: (ShortMember & { // @ts-ignore
    task?: Task })[] = [];

  constructor(private groupService: GroupService, private router: Router) {}

  goToTaskDetails(memberId: number) {
    this.router.navigate([`/leaders/my-group/members/${memberId}/tasks`]).then();
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
