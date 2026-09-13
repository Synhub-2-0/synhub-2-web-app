import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import {BaseApiService} from '@app/shared/services/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class MemberApiService extends BaseApiService<any> {
  constructor() {
    super();
    this.resourceEndPoint = '/member';
  }

  /**
   * Get all tasks by authenticated member
   * GET /api/v1/member/tasks
   */
  getTasksForAuthenticatedMember(): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePath()}/tasks`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get all tasks by member id
   * GET /api/v1/members/{memberId}/tasks
   */
  getTasksForMember(memberId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePath()}s/${memberId}/tasks`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
