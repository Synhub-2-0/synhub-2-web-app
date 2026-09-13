import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/shared/services/base-api.service';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaksApiService extends BaseApiService<any> {
  constructor() {
    super();
    this.resourceEndPoint = '/tasks';
  }

  /**
   * Get all tasks by status
   * GET /api/v1/tasks/status/{status}
   */
  getTasksByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePath()}/status/${status}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
