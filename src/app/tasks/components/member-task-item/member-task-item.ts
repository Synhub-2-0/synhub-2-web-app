import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task, TaskStatus } from '../../model/task.model';
import { TasksApiService } from '../../services/tasks-api.service';
import {RequestApiService} from '@app/requests/services/request-api.service';

@Component({
  selector: 'member-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-task-item.html',
  styleUrls: ['./member-task-item.css']
})
export class MemberTaskItemComponent implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Output() changed = new EventEmitter<void>();

  protected tasksApiService = inject(TasksApiService);
  private requestApiService = inject(RequestApiService);
  private router = inject(Router);

  TaskStatus = TaskStatus;
  remainingLabel = '—';

  ngOnChanges(_: SimpleChanges) { this.computeStatics(); }

  private computeStatics() {
    const end = this.task?.dueDate ? new Date(this.task.dueDate).getTime() : NaN;
    const now = Date.now();
    if (!isNaN(end)) {
      const diff = Math.max(end - now, 0);
      const d = Math.floor(diff / (24 * 60 * 60 * 1000));
      const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      this.remainingLabel = `${d}d:${String(h).padStart(2, '0')}hrs:${String(m).padStart(2, '0')}min`;
    } else {
      this.remainingLabel = '—';
    }
  }

  get progressClass(): 'ok' | 'warn' | 'late' | 'unknown' | 'hold' | 'done' {
    const status = this.task?.status;

    if (status === TaskStatus.ON_HOLD) return 'hold';
    if (status === TaskStatus.DONE) return 'done';
    if (status === TaskStatus.COMPLETED) return 'ok';
    if (status === TaskStatus.EXPIRED) return 'late';

    const dueMs   = this.task?.dueDate   ? new Date(this.task.dueDate).getTime()   : NaN;
    const startMs = this.task?.createdAt ? new Date(this.task.createdAt!).getTime() : NaN;
    if (isNaN(dueMs)) return 'unknown';
    const start = isNaN(startMs) ? Date.now() : startMs;
    const end   = dueMs;
    if (end <= start) return Date.now() > end ? 'late' : 'unknown';
    const now = Date.now();
    if (now > end) return 'late';
    const ratio = (now - start) / (end - start);
    return ratio < 0.7 ? 'ok' : 'warn';
  }

  open() {
    this.router.navigate(['/members/my-group/tasks', this.task.id], { state: { from: 'member' } });
  }

  goComment() {
    this.router.navigate(['/members/my-group/tasks', this.task.id, 'comment']);
  }

  markDone() {
    this.requestApiService.createRequest(this.task.id, 'Se ha completado la tarea.', 'SUBMISSION').subscribe({ next: () => {
        this.tasksApiService.updateStatus(this.task.id, TaskStatus.COMPLETED).subscribe({ next: () => this.changed.emit() });
    }});
  }
}
