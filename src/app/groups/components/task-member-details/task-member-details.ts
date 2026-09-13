import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '@env/environment';

export type TaskStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'ON_HOLD' | 'DONE';

export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public dueDate: string,
    public createdAt: string,
    public updatedAt: string,
    public status: TaskStatus,
    public member: {
      id: number;
      name: string;
      surname: string;
      urlImage: string;
    },
    public groupId: number
  ) {}
}
@Component({
  selector: 'app-task-member-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 bg-white min-h-screen">
      <label class="text-xl mb-6 block font-semibold text-slate-900">
        Estado:
        <select class="rounded px-4 py-2 ml-2 text-lg border border-gray-300" [(ngModel)]="selectedStatus" (change)="filtrar()">
          <option value="ALL">todos</option>
          <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
        </select>
      </label>
      <div
        class="grid gap-8"
        [ngClass]="{ 'grid-cols-1 md:grid-cols-2': true }"
      >
        <div *ngFor="let task of filteredTasks"
             class="bg-white rounded-2xl border border-gray-100 px-8 py-6 mb-8"
             style="min-width:320px;">
          <div class="flex items-center mb-2">
            <img [src]="task.member.urlImage"
                 class="w-14 h-14 rounded-full border border-gray-200 mr-4" alt="avatar" />
            <div>
              <div class="font-semibold text-lg text-slate-900 mb-1">
                {{ task.member.name }} {{ task.member.surname }}
              </div>
              <div class="text-2xl font-bold text-gray-900">
                {{ task.title }}
              </div>
            </div>
            <div class="ml-auto px-6 py-2 rounded-full bg-gray-200 text-slate-700 text-lg font-semibold shadow" style="letter-spacing:1px;">
              {{ task.status }}
            </div>
          </div>
          <hr class="border border-gray-100 my-2">
          <div class="rounded-xl bg-gray-50 text-gray-900 p-4 text-lg mb-3 min-h-32 flex items-center">
            {{ task.description }}
          </div>
          <div class="w-full h-3 mb-2 mt-4">
            <div
              class="rounded-full h-3"
              [ngStyle]="{ background: getColor(task.status), width: '100%' }">
            </div>
          </div>
          <div class="text-lg text-gray-500 text-center tracking-wide mt-4 mb-0 font-medium">
            Vence: {{ task.dueDate | date:'MMM d, yyyy' }}
          </div>
        </div>
      </div>
      <ng-template #noTasks>
        <p class="text-slate-700 text-xl mt-10">No hay tareas para mostrar para este miembro.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    @media (min-width: 640px) {
      .tasks-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    select { background: #fff; }
  `]
})
export class TaskMemberDetailsComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus: string = 'ALL';
  statusOptions: TaskStatus[] = ['IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'ON_HOLD', 'DONE'];
  memberId!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.memberId = Number(this.route.snapshot.paramMap.get('memberId'));
    if (this.memberId) {
      this.http.get<Task[]>(`${environment.baseUrl}/members/${this.memberId}/tasks`)
        .subscribe({
          next: (tasks) => {
            this.tasks = tasks;
            this.filtrar();
          },
          error: (err) => console.error('Error al obtener tareas del miembro', err)
        });
    }
  }

  filtrar() {
    if (this.selectedStatus === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === this.selectedStatus);
    }
  }

  getColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return '#00c85a'; // verde
      case 'IN_PROGRESS': return '#00c85a';
      case 'EXPIRED': return '#fa2e2e'; // rojo
      case 'ON_HOLD': return '#ffd43b'; // amarillo
      case 'DONE': return '#1e88e5'; // azul
      default: return '#ecf0f1';
    }
  }
}
