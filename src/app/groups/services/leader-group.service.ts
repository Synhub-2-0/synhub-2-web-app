import { Injectable } from '@angular/core';
import {CreateGroupRequest} from '@app/groups/model/requests/create-group.request';
import {CreateGroupResponse} from '@app/groups/model/response/create-group.response';
import {BaseApiService} from '@app/shared/services/base-api.service';
import {Group} from '@app/groups/model/group.entity';
import {catchError, Observable, retry} from 'rxjs';
import {UpdateGroupRequest} from '@app/groups/model/requests/update-group.request';

@Injectable({
  providedIn: 'root'
})
export class LeaderGroupService extends BaseApiService<Group>{

  constructor() {
    super();
    this.resourceEndPoint = '/leader';
  }

  getLeaderGroup(): Observable<Group> {
    return this.http.get<Group>(`${this.resourcePath()}/group`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  updateLeaderGroup(updateGroupRequest: UpdateGroupRequest) : Observable<Group> {
    return this.http.put<Group>(`${this.resourcePath()}/group`, JSON.stringify(updateGroupRequest), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  createGroup(createGroupRequest: CreateGroupRequest) : Observable<CreateGroupResponse> {
    return this.http.post<CreateGroupResponse>(`${this.resourcePath()}/group`, JSON.stringify(createGroupRequest), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  deleteGroup(): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/group`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  deleteMemberFromGroup(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/group/members/${memberId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }


}
