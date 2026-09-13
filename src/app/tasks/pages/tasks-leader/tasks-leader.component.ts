import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TasksApiService, Task, TaskStatus } from '../../services/tasks-api.service';
import { LeaderTaskItemComponent } from '../../components/leader-task-item/leader-task-item';

@Component({
  selector: 'app-tasks-leader',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LeaderTaskItemComponent],
  templateUrl: './tasks-leader.component.html',
  styleUrl: './tasks-leader.component.css'
})
export class TasksLeaderComponent {
  private api = inject(TasksApiService);

  private allTasks = signal<Task[]>([]);
  totalCount = signal<number>(0);

  filter = signal<TaskStatus | 'ALL'>('ALL');
  TaskStatus = TaskStatus;
  statusOptions: (TaskStatus | 'ALL')[] = [
    'ALL',
    TaskStatus.ON_HOLD,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
    TaskStatus.COMPLETED,
    TaskStatus.EXPIRED
  ];

  // etiquetas en español (minúsculas)
  private statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.IN_PROGRESS]: 'en progreso',
    [TaskStatus.DONE]: 'terminado',
    [TaskStatus.COMPLETED]: 'completado',
    [TaskStatus.EXPIRED]: 'vencido',
    [TaskStatus.ON_HOLD]: 'en espera'
  };
  labelFor(s: TaskStatus | 'ALL'): string {
    return s === 'ALL' ? 'todos' : this.statusLabels[s];
  }

  filtered = computed(() => {
    const f = this.filter();
    const all = this.allTasks();
    return f === 'ALL' ? all : all.filter(t => t.status === f);
  });

  ngOnInit() { this.load(); }

  load(): void {
    this.api.getAllStatuses().subscribe({
      next: data => {
        this.allTasks.set(data);
        this.totalCount.set(data.length);
      }
    });
  }
}
