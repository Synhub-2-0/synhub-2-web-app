import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TasksApiService, Task, TaskStatus } from '@app/tasks/services/tasks-api.service';

@Component({
  selector: 'app-task-member-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './task-member-details.component.html',
  styleUrl: './task-member-details.component.css'
})
export class TaskMemberDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksApi = inject(TasksApiService);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus = 'ALL';
  statusOptions: string[] = [
    TaskStatus.IN_PROGRESS,
    TaskStatus.ON_HOLD,
    TaskStatus.COMPLETED,
    TaskStatus.DONE,
    TaskStatus.EXPIRED
  ];
  memberId!: number;
  loading = true;

  ngOnInit(): void {
    this.memberId = Number(this.route.snapshot.paramMap.get('memberId'));
    if (!this.memberId) {
      this.loading = false;
      return;
    }
    this.tasksApi.getTasksByMember(this.memberId).subscribe({
      next: tasks => {
        this.tasks = tasks || [];
        this.filtrar();
        this.loading = false;
      },
      error: () => {
        this.tasks = [];
        this.filteredTasks = [];
        this.loading = false;
      }
    });
  }

  filtrar(): void {
    this.filteredTasks = this.selectedStatus === 'ALL'
      ? [...this.tasks]
      : this.tasks.filter(task => task.status === this.selectedStatus);
  }

  goBack(): void {
    this.router.navigate(['/leaders/my-group']).then();
  }

  getColor(status: string): string {
    switch (status) {
      case TaskStatus.COMPLETED: return '#10b981';
      case TaskStatus.IN_PROGRESS: return '#4A90E2';
      case TaskStatus.EXPIRED: return '#ef4444';
      case TaskStatus.ON_HOLD: return '#f59e0b';
      case TaskStatus.DONE: return '#3b82f6';
      default: return '#cbd5e1';
    }
  }
}
