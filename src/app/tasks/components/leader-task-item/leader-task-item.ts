import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus } from '../../model/task.model';
import { TasksApiService } from '../../services/tasks-api.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog';

@Component({
  selector: 'leader-task-item',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './leader-task-item.html',
  styleUrls: ['./leader-task-item.css']
})
export class LeaderTaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() changed = new EventEmitter<void>();

  protected api = inject(TasksApiService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  TaskStatus = TaskStatus;

  get canModify(): boolean {
    return this.task?.status === TaskStatus.IN_PROGRESS || this.task?.status === TaskStatus.ON_HOLD;
  }

  open() {
    this.router.navigate(['/leaders/my-group/tasks', this.task.id]);
  }

  edit(ev?: Event) {
    ev?.stopPropagation();
    this.router.navigate(['/leaders/my-group/tasks', this.task.id, 'edit']);
  }

  confirmRemove(ev?: Event) {
    ev?.stopPropagation();
    const ref = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: 'Eliminar tarea',
        message: `Esta seguro(a) que quieres eliminar la tarea "${this.task.title}"?`
      }
    });
    ref.afterClosed().subscribe(yes => {
      if (yes) {
        this.api.deleteTask(this.task.id).subscribe({ next: () => this.changed.emit() });
      }
    });
  }

  changeStatus(status: TaskStatus) {
    this.api.updateStatus(this.task.id, status).subscribe({ next: () => this.changed.emit() });
  }

  get initials(): string {
    const member = this.task.member ?? this.task.user;
    const n = (member?.name || '').trim();
    const s = (member?.surname || '').trim();
    const ini = (n[0] || '') + (s[0] || '');
    return ini.toUpperCase() || 'U';
  }

  get assignedUser() {
    return this.task.member ?? this.task.user ?? null;
  }

  get avatarUrl(): string | null {
    return this.assignedUser?.urlImage || this.assignedUser?.imgUrl || null;
  }

  get statusBadgeClass(): string {
    switch (this.task?.status) {
      case TaskStatus.COMPLETED: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case TaskStatus.DONE: return 'bg-blue-50 text-blue-700 border-blue-200';
      case TaskStatus.IN_PROGRESS: return 'bg-[#e0efff] text-[#1A4E85] border-[#b8daff]';
      case TaskStatus.ON_HOLD: return 'bg-amber-50 text-amber-700 border-amber-200';
      case TaskStatus.EXPIRED: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  get progressClass(): string {
    const status = this.task?.status;

    if (status === TaskStatus.ON_HOLD) return 'bg-amber-500';
    if (status === TaskStatus.DONE) return 'bg-blue-500';
    if (status === TaskStatus.COMPLETED) return 'bg-green-500';
    if (status === TaskStatus.EXPIRED) return 'bg-red-500';

    const dueMs   = this.task?.dueDate   ? new Date(this.task.dueDate).getTime()   : NaN;
    const startMs = this.task?.createdAt ? new Date(this.task.createdAt!).getTime() : NaN;
    if (isNaN(dueMs)) return 'bg-slate-200';

    const start = isNaN(startMs) ? Date.now() : startMs;
    const end   = dueMs;
    if (end <= start) return Date.now() > end ? 'bg-red-500' : 'bg-slate-200';

    const now = Date.now();
    if (now > end) return 'bg-red-500';

    const ratio = (now - start) / (end - start);
    return ratio < 0.7 ? 'bg-green-500' : 'bg-amber-500';
  }
}
