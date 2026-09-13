import { Injectable } from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {Invitation} from '../model/invitation.entity';
import {catchError, Observable, retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationsApiService extends BaseApiService<Invitation>{
  constructor() {
    super();
    this.resourceEndPoint = '/invitations';
  }

  getInvitationsByMember(): Observable<Invitation> {
    return this.http.get<Invitation>(`${this.resourcePath()}/member`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  cancelInvitation(): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/member`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  sendInvitation(id: number | undefined): Observable<void> {
    return this.http.post<void>(`${this.resourcePath()}/groups/${id}`, {}, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  fetchGroupInvitations(): Observable<Invitation[]>{
    return this.http.get<Invitation[]>(`${this.resourcePath()}/group`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
