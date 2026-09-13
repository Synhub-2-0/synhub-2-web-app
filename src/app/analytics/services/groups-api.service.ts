import { Injectable } from '@angular/core';
import { BaseApiService } from '../../shared/services/base-api.service';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsApiService extends BaseApiService<any> {
  constructor() {
    super();
    this.resourceEndPoint = '/groups';
  }

  getAllGroupMembers(): Observable<any> {
    return this.http.get<any>(`${this.resourcePath()}/members`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
