import { Injectable } from '@angular/core';
import { CreateGroupRequest } from '@app/groups/model/requests/create-group.request';
import { UpdateGroupRequest } from '@app/groups/model/requests/update-group.request';
import { BaseApiService } from '@app/shared/services/base-api.service';
import { Group } from '@app/groups/model/group.entity';
import { catchError, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderGroupService extends BaseApiService<Group> {
  constructor() {
    super();
    this.resourceEndPoint = '/groups';
  }

  /** GET /api/v1/groups/user/role?groupRole=GROUP_LEADER */
  getLeaderGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(
      `${this.resourcePath()}/user/role?groupRole=GROUP_LEADER`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** POST /api/v1/groups */
  createGroup(createGroupRequest: CreateGroupRequest): Observable<Group> {
    return this.http.post<Group>(
      `${this.resourcePath()}`,
      JSON.stringify(createGroupRequest),
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** PUT /api/v1/groups/{groupId} */
  updateLeaderGroup(groupId: number, updateGroupRequest: UpdateGroupRequest): Observable<Group> {
    return this.http.put<Group>(
      `${this.resourcePath()}/${groupId}`,
      JSON.stringify(updateGroupRequest),
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** DELETE /api/v1/groups/{groupId} */
  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.resourcePath()}/${groupId}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
