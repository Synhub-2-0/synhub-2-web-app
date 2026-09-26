import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/shared/services/base-api.service';
import { Group } from '@app/groups/model/group.entity';
import { catchError, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberGroupService extends BaseApiService<Group> {
  constructor() {
    super();
    this.resourceEndPoint = '/groups';
  }

  /** GET /api/v1/groups/user/role?groupRole=GROUP_MEMBER */
  getMemberGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(
      `${this.resourcePath()}/user/role?groupRole=GROUP_MEMBER`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
