import { Injectable } from '@angular/core';
import {BaseApiService} from '@app/shared/services/base-api.service';
import {Request} from '@app/requests/model/request.entity';
import {catchError, Observable, retry} from 'rxjs';
import {Task} from '@app/shared/model/task.entity';
import {CreateRequest} from '@app/requests/model/createRequest.entity';

@Injectable({
  providedIn: 'root'
})
export class RequestApiService extends BaseApiService<Request>{
  constructor() {
    super();
    this.resourceEndPoint = '';
  }

  getLeaderRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.resourcePath()}/leader/group/requests`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getMemberRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.resourcePath()}/member/group/requests`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getRequestByTaskIdAndRequestId(taskId: number, requestId: number): Observable<Request> {
    return this.http.get<Request>(`${this.resourcePath()}/tasks/${taskId}/requests/${requestId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateRequestStatus(taskId: number, requestId: number, status: string): Observable<Request> {
    return this.http.put<Request>(`${this.resourcePath()}/tasks/${taskId}/requests/${requestId}/status/${status}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.put<Task>(`${this.resourcePath()}/tasks/${taskId}/status/${status}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  deleteRequest(taskId: number, requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/tasks/${taskId}/requests/${requestId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  createRequest(taskId: number, description: string, requestType: string): Observable<CreateRequest> {
    return this.http.post<CreateRequest>(`${this.resourcePath()}/tasks/${taskId}/requests`, {
      description,
      requestType
    }, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
