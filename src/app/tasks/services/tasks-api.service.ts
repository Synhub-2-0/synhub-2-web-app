import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { Group } from '@app/groups/model/group.entity';
import { Task, TaskMember, TaskStatus, UpdateTaskResource } from '../model/task.model';

export { TaskStatus };
export type { Task, TaskMember };

export interface GroupMember {
  id: number;
  username?: string;
  name: string;
  surname: string;
  urlImage: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.baseUrl}/tasks`;

  getByStatus(status: TaskStatus | string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BASE}/status/${status}`).pipe(
      catchError(() => of([]))
    );
  }

  getById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.BASE}/${taskId}`);
  }

  getAllStatuses(): Observable<Task[]> {
    const statuses = [
      TaskStatus.ON_HOLD,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
      TaskStatus.COMPLETED,
      TaskStatus.EXPIRED
    ];
    return forkJoin(statuses.map(status => this.getByStatus(status))).pipe(
      map(parts => {
        const unique = new Map<number, Task>();
        parts.flat().forEach(task => unique.set(task.id, task));
        return Array.from(unique.values());
      })
    );
  }

  getTasksByMember(memberId: number): Observable<Task[]> {
    return this.getAllStatuses().pipe(
      map(tasks => tasks.filter(task => {
        const assignedId = task.userId ?? task.member?.id ?? task.user?.id;
        return assignedId ? assignedId === memberId : true;
      }))
    );
  }

  getTasksForAuthenticatedMember(): Observable<Task[]> {
    return this.getAllStatuses();
  }

  createTaskForMember(
    userId: number,
    payload: { title: string; description?: string; dueDate: string }
  ): Observable<Task> {
    const body: UpdateTaskResource = {
      title: payload.title,
      description: payload.description ?? '',
      dueDate: payload.dueDate,
      userId
    };
    return this.http.post<Task>(this.BASE, body);
  }

  updateTask(
    taskId: number,
    payload: { title: string; description?: string; dueDate: string; userId: number }
  ): Observable<Task> {
    const body: UpdateTaskResource = {
      title: payload.title,
      description: payload.description ?? '',
      dueDate: payload.dueDate,
      userId: payload.userId
    };
    return this.http.put<Task>(`${this.BASE}/${taskId}`, body);
  }

  updateStatus(taskId: number, status: TaskStatus | string): Observable<Task> {
    return this.http.put<Task>(`${this.BASE}/${taskId}/status/${status}`, {});
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${taskId}`);
  }

  getGroupMembers(): Observable<GroupMember[]> {
    const url = `${environment.baseUrl}/groups/user/role?groupRole=GROUP_LEADER`;
    return this.http.get<Group[]>(url).pipe(
      map(groups => (groups?.[0]?.usersInGroup || [])
        .filter(entry => entry.roleInGroup === 'GROUP_MEMBER')
        .map(entry => ({
          id: entry.user.id,
          username: entry.user.username,
          name: entry.user.name,
          surname: entry.user.surname,
          urlImage: entry.user.imgUrl || '',
          email: entry.user.email
        }))),
      catchError(() => of([]))
    );
  }
}
