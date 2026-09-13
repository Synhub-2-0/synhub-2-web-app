import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksApiService, Task } from '../../services/tasks-api.service';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-task.html',
  styleUrls: ['./view-task.css']
})
export class ViewTaskComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(TasksApiService);

  task?: Task;
  loading = true;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.back(); return; }
    this.api.getById(id).subscribe({
      next: (t) => { this.task = t; this.loading = false; },
      error: () => { alert('No se pudo cargar la tarea'); this.back(); }
    });
  }

  back() {
    const fromState = (history.state && history.state.from) as string | null;
    if (fromState === 'member') {
      this.router.navigate(['/members/my-group/tasks']);
      return;
    }
    const isMemberPath = this.router.url.startsWith('/members/');
    this.router.navigate([isMemberPath ? '/members/my-group/tasks' : '/leaders/my-group/tasks']);
  }

  progressClass(): 'ok' | 'warn' | 'late' | 'unknown' {
    if (!this.task?.dueDate) return 'unknown';
    const end = new Date(this.task.dueDate).getTime();
    const start = this.task.createdAt ? new Date(this.task.createdAt).getTime() : Date.now();
    if (end <= start) return Date.now() > end ? 'late' : 'unknown';
    const now = Date.now();
    if (now > end) return 'late';
    const ratio = (now - start) / (end - start);
    return ratio < 0.7 ? 'ok' : 'warn';
  }
}
