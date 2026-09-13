import { Injectable } from '@angular/core';
import {BaseApiService} from '@app/shared/services/base-api.service';
import {Group} from '@app/groups/model/group.entity';
import {Observable} from 'rxjs';
import {ShortMember} from '@app/shared/model/short-member.entity';
import { Task } from "@app/shared/model/task.entity";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseApiService<Group>{
  constructor() {
    super();
    this.resourceEndPoint = '/groups';
  }

  getAllTasksOfGroup() : Observable<Task[]>{
    return this.http.get<Task[]>(`${this.resourcePath()}`, this.httpOptions);
  }

  searchGroupByCode(code: string): Observable<Group>{
    return this.http.get<Group>(`${this.resourcePath()}/search?code=${code}`, this.httpOptions);
  }

  getGroupMembers(): Observable<ShortMember[]> {
    return this.http.get<ShortMember[]>(`${this.resourcePath()}/members`, this.httpOptions);
  }

  getAllMembersOfGroup(): Observable<ShortMember[]>{
    return this.http.get<ShortMember[]>(`${this.resourcePath()}/members`, this.httpOptions);
  }

  getAllTasksByGroupId(groupId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.resourcePath()}/tasks?groupId=${groupId}`, this.httpOptions);
  }



}
