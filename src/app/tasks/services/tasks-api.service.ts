import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { environment } from '@env/environment';

export interface GroupMember {
  id: number;
  name: string;
  surname: string;
  urlImage: string;
}

export enum TaskStatus {
  ON_HOLD = 'ON_HOLD',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DONE = 'DONE',
  EXPIRED = 'EXPIRED',
}

export interface TaskMember {
  id: number;
  name: string;
  surname: string;
  urlImage: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status: TaskStatus | string;
  member?: TaskMember | null;
  groupId?: number;
}

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.baseUrl}/tasks`;

  getByStatus(status: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BASE}/status/${status}`);
  }

  getById(taskId: number) {
    return this.http.get<Task>(`${this.BASE}/${taskId}`);
  }

  getAllStatuses() {
    const statuses = [TaskStatus.ON_HOLD, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.COMPLETED, TaskStatus.EXPIRED];
    return forkJoin(
      statuses.map(s =>
        this.getByStatus(s).pipe(catchError(() => of([] as Task[])))
      )
    ).pipe(map(parts => parts.flat()));
  }

  getTasksByMember(memberId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.baseUrl}/members/${memberId}/tasks`);
  }

  createTaskForMember(
    memberId: number,
    payload: { title: string; description?: string; dueDate?: string }
  ): Observable<void> {
    const body = {
      title: payload.title,
      description: payload.description ?? undefined,
      dueDate: payload.dueDate
    };
    return this.http.post<void>(`${environment.baseUrl}/members/${memberId}/tasks`, body);
  }

  updateTask(taskId: number, payload: { title?: string; description?: string; dueDate?: string; memberId?: number | null }): Observable<void> {
    return this.http.put<void>(`${this.BASE}/${taskId}`, payload);
  }

  updateStatus(taskId: number, status: TaskStatus): Observable<void> {
    return this.http.put<void>(`${this.BASE}/${taskId}/status/${status}`, {});
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${taskId}`);
  }

  getGroupMembers(): Observable<GroupMember[]> {
    const url = `${environment.baseUrl}/groups/members`;
    return this.http.get<any[]>(url).pipe(
      map(items =>
        items.map(m => ({
          id: m.id,
          name: m.name,
          surname: m.surname,
          urlImage: m.imgUrl || ''
        }) as GroupMember)
      )
    );
  }

  getTasksForAuthenticatedMember(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.baseUrl}/member/tasks`);
  }
}
