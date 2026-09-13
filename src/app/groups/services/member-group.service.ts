import { Injectable } from '@angular/core';
import {BaseApiService} from '@app/shared/services/base-api.service';
import {Group} from '@app/groups/model/group.entity';
import {catchError, Observable, retry} from 'rxjs';
import {MemberGroup} from '@app/groups/model/member-group.entity';

@Injectable({
  providedIn: 'root'
})
export class MemberGroupService extends BaseApiService<Group> {
  constructor() {
    super();
    this.resourceEndPoint = ''; // plural según API
  }

  getMemberGroup(): Observable<MemberGroup> {
    return this.http.get<MemberGroup>(`${this.resourcePath()}/member/group`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getMemberTasks(memberId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePath()}/${memberId}/tasks`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
