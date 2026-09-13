import { Injectable } from '@angular/core';
import {Leader} from '../model/leader.entity';
import {Router} from '@angular/router';
import {catchError, Observable, retry} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {Member} from '../model/member.entity';
import {Group} from '../../groups/model/group.entity';

@Injectable({
  providedIn: 'root'
})
export class DetailsService extends BaseApiService<Leader>{

  constructor(private router: Router) {
    super();
    this.resourceEndPoint = '';
  }

  getMemberDetails(): Observable<Member> {
    return this.http.get<Member>(`${this.resourcePath()}/member/details`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getLeaderDetails(): Observable<Leader> {
    return this.http.get<Leader>(`${this.resourcePath()}/leader/details`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getMemberGroup(): Observable<Group>{
    return this.http.get<Group>(`${this.resourcePath()}/member/group`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  acceptOrDeclineInvitation(invitationId: number, accept: boolean): Observable<void> {
    const url = `${this.resourcePath()}/group/invitations/${invitationId}?accept=${accept}`;
    return this.http.patch<void>(url, {}, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

}
