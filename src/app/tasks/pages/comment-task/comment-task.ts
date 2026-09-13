import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksApiService, Task } from '../../services/tasks-api.service';
import {RequestApiService} from '@app/requests/services/request-api.service';
import {TaskStatus} from '@app/tasks/model/task.model';

@Component({
  selector: 'app-comment-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-task.html',
  styleUrls: ['./comment-task.css']
})
export class CommentTaskComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected tasksApiService = inject(TasksApiService);
  private requestApiService = inject(RequestApiService);
  task?: Task;
  taskId!: number;

  comment = '';
  loading = true;
  saving  = false;

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.taskId) {
      this.router.navigate(['/members/my-group/tasks']);
      return;
    }

    this.tasksApiService.getById(this.taskId).subscribe({
      next: (t) => { this.task = t; this.loading = false; },
      error: () => { this.router.navigate(['/members/my-group/tasks']); }
    });
  }

  get progressClass(): 'ok' | 'warn' | 'late' | 'unknown' {
    const dueMs   = this.task?.dueDate   ? new Date(this.task!.dueDate!).getTime()   : NaN;
    const startMs = this.task?.createdAt ? new Date(this.task!.createdAt!).getTime() : NaN;
    if (isNaN(dueMs)) return 'unknown';
    const start = isNaN(startMs) ? Date.now() : startMs;
    const end   = dueMs;
    if (end <= start) return Date.now() > end ? 'late' : 'unknown';
    const now = Date.now();
    if (now > end) return 'late';
    const ratio = (now - start) / (end - start);
    return ratio < 0.7 ? 'ok' : 'warn';
  }

  get dueLabel(): string {
    return this.task?.dueDate ? new Date(this.task!.dueDate!).toLocaleDateString() : '—';
  }

  get remainingLabel(): string {
    if (!this.task?.dueDate) return '—';
    const now = Date.now();
    const end = new Date(this.task!.dueDate!).getTime();
    const delta = Math.max(0, end - now);
    const d = Math.floor(delta / (24*3600e3));
    const h = Math.floor((delta % (24*3600e3)) / 3600e3);
    const m = Math.floor((delta % 3600e3) / 60000);
    return `${d}d:${h}hrs:${m}min`;
  }

  submit() {
    if (!this.comment.trim()) return;
    this.saving = true;
    console.log('Comentario preparado para enviar:', {
      taskId: this.taskId,
      message: this.comment.trim()
    });

    this.requestApiService.createRequest(this.taskId, this.comment.trim(), 'MODIFICATION').subscribe({ next: () => {
        this.tasksApiService.updateStatus(this.taskId, TaskStatus.ON_HOLD).subscribe({ next: () =>{
            this.saving = false;
            this.router.navigate(['/members/my-group/tasks']);
          } });
      }});
  }

  cancel() { this.router.navigate(['/members/my-group/tasks']); }
}
