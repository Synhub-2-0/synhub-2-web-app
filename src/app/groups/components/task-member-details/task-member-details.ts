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
    <div class="p-4 md:p-8 bg-white min-h-screen">
      <label class="text-lg md:text-xl mb-6 block font-semibold text-slate-900">
        Estado:
        <select class="rounded px-4 py-2 ml-2 text-base md:text-lg border border-gray-300 w-full sm:w-auto mt-2 sm:mt-0" [(ngModel)]="selectedStatus" (change)="filtrar()">
          <option value="ALL">todos</option>
          <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
        </select>
      </label>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div *ngFor="let task of filteredTasks"
             class="bg-white w-full rounded-2xl border border-gray-100 px-5 md:px-8 py-6 shadow-sm">
          <div class="flex flex-wrap sm:flex-nowrap items-center mb-4 gap-3">
            <img [src]="task.member.urlImage"
                 class="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-200 object-cover" alt="avatar" />
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-base md:text-lg text-slate-900 mb-0.5 truncate">
                {{ task.member.name }} {{ task.member.surname }}
              </div>
              <div class="text-xl md:text-2xl font-bold text-gray-900 truncate">
                {{ task.title }}
              </div>
            </div>
            <div class="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-1.5 rounded-full bg-gray-200 text-slate-700 text-sm md:text-lg font-semibold shadow text-center tracking-wide">
              {{ task.status }}
            </div>
          </div>
          <hr class="border border-gray-100 my-3">
          <div class="rounded-xl bg-gray-50 text-gray-900 p-4 text-base md:text-lg mb-3 min-h-[120px] flex items-center">
            {{ task.description }}
          </div>
          <div class="w-full h-3 mb-2 mt-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              [ngStyle]="{ background: getColor(task.status), width: '100%' }">
            </div>
          </div>
          <div class="text-sm md:text-lg text-gray-500 text-center tracking-wide mt-4 mb-0 font-medium">
            Vence: {{ task.dueDate | date:'MMM d, yyyy' }}
          </div>
        </div>
      </div>
      <ng-template #noTasks>
        <p class="text-slate-700 text-lg md:text-xl mt-10">No hay tareas para mostrar para este miembro.</p>
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
