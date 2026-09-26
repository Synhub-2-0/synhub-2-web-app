import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/shared/services/base-api.service';
import { Group, GroupReduced, RoleInGroup } from '@app/groups/model/group.entity';
import { catchError, map, Observable, retry } from 'rxjs';
import { ShortMember } from '@app/shared/model/short-member.entity';
import { Task } from '@app/shared/model/task.entity';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseApiService<Group> {
  constructor() {
    super();
    this.resourceEndPoint = '/groups';
  }

  /** GET /api/v1/groups/{groupId} */
  getGroupById(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.resourcePath()}/${groupId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** GET /api/v1/groups/user */
  getGroupsByUser(): Observable<GroupReduced[]> {
    return this.http.get<GroupReduced[]>(`${this.resourcePath()}/user`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** GET /api/v1/groups/user/role?groupRole=GROUP_LEADER | GROUP_MEMBER */
  getGroupsByUserRole(groupRole: RoleInGroup): Observable<Group[]> {
    return this.http.get<Group[]>(
      `${this.resourcePath()}/user/role?groupRole=${groupRole}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** GET /api/v1/groups/search?code=... */
  searchGroupByCode(code: string): Observable<Group> {
    return this.http.get<Group>(
      `${this.resourcePath()}/search?code=${encodeURIComponent(code.trim())}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** Compatibilidad con MembersLeaderComponent extrayendo los miembros del grupo del líder */
  getGroupMembers(): Observable<ShortMember[]> {
    return this.getGroupsByUserRole('GROUP_LEADER').pipe(
      map(groups => {
        if (!groups || groups.length === 0) return [];
        return (groups[0].usersInGroup || [])
          .filter(u => u.roleInGroup === 'GROUP_MEMBER')
          .map(u => ({
            id: u.user.id,
            name: u.user.name,
            surname: u.user.surname,
            imgUrl: u.user.imgUrl
          } as ShortMember));
      })
    );
  }

  getAllMembersOfGroup(): Observable<ShortMember[]> {
    return this.getGroupMembers();
  }

  getAllTasksOfGroup(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.resourcePath()}`, this.httpOptions);
  }

  getAllTasksByGroupId(groupId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.resourcePath()}/tasks?groupId=${groupId}`, this.httpOptions);
  }
}
