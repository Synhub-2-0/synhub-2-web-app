import { Injectable } from '@angular/core';
import { BaseApiService } from '../../shared/services/base-api.service';
import { LeaderAnalyticsResource } from '../models/analytics-leader.entity';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsLeaderApiService extends BaseApiService<LeaderAnalyticsResource> {
  constructor() {
    super();
    this.resourceEndPoint = '/metrics';
  }

  getTaskTimePassedForMember(memberId: number): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/task/member/${memberId}/time-passed`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getRescheduledTasksForMember(memberId: number): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/member/${memberId}/tasks/rescheduled`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getTaskOverviewForMember(memberId: number): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/member/${memberId}/tasks/overview`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getAvgCompletionTimeForMember(memberId: number): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/member/${memberId}/tasks/avg-completion-time`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getInProgressTaskDuration(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/task/${taskId}/duration`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

}
