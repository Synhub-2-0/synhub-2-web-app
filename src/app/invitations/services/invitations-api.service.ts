import { Injectable } from '@angular/core';
import { BaseApiService } from '../../shared/services/base-api.service';
import { CreateInvitationRequest, Invitation } from '../model/invitation.entity';
import { GroupUser } from '@app/groups/model/group.entity';
import { catchError, Observable, retry, switchMap } from 'rxjs';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationsApiService extends BaseApiService<Invitation> {
  private readonly usersUrl = `${environment.baseUrl}/users`;

  constructor() {
    super();
    this.resourceEndPoint = '/invitations';
  }

  /** POST /api/v1/invitations */
  createInvitation(request: CreateInvitationRequest): Observable<Invitation> {
    return this.http.post<Invitation>(
      `${this.resourcePath()}`,
      JSON.stringify(request),
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** Obtiene el usuario logueado (GET /api/v1/users/me) y crea la invitación al grupo */
  sendInvitationToGroup(groupId: number): Observable<Invitation> {
    return this.http.get<GroupUser>(`${this.usersUrl}/me`, this.httpOptions).pipe(
      switchMap(currentUser =>
        this.createInvitation({ userId: currentUser.id, groupId })
      ),
      catchError(this.handleError)
    );
  }

  /** Busca un usuario por username (GET /api/v1/users/username) y le envía invitación */
  inviteUserByUsername(username: string, groupId: number): Observable<Invitation> {
    return this.http.get<GroupUser>(
      `${this.usersUrl}/username?username=${encodeURIComponent(username.trim())}`,
      this.httpOptions
    ).pipe(
      switchMap(targetUser =>
        this.createInvitation({ userId: targetUser.id, groupId })
      ),
      catchError(this.handleError)
    );
  }

  /** POST /api/v1/invitations/accept?invitationId=... */
  acceptInvitation(invitationId: number): Observable<void> {
    return this.http.post<void>(
      `${this.resourcePath()}/accept?invitationId=${invitationId}`,
      {},
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** GET /api/v1/invitations/user */
  getInvitationsByUser(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(
      `${this.resourcePath()}/user`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** GET /api/v1/invitations/group?groupId=... */
  fetchGroupInvitations(groupId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(
      `${this.resourcePath()}/group?groupId=${groupId}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** DELETE /api/v1/invitations/{invitationId} */
  cancelInvitation(invitationId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.resourcePath()}/${invitationId}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
