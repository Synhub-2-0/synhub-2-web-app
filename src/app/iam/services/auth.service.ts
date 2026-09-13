import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, of} from 'rxjs';
import { Router } from '@angular/router';
import {SignInRequest} from "../model/requests/sign-in.request";
import {SignInResponse} from "../model/responses/sign-in.response";
import {SignUpRequest} from '../model/requests/sign-up.request';
import {DetailsService} from '../../shared/services/details.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  basePath: string = `${environment.baseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'}) };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private signedInUserType: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router, private http: HttpClient, private detailApiService: DetailsService) { }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  get currentUserType() {
    return this.signedInUserType.asObservable();
  }

  signUp(signUpRequest: SignUpRequest) {
    return this.http.post(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: () => {
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  /**
   * Sign up a new user.
   * @param signUpRequest The sign up request.
   * @returns The sign up response.
   */
  /*
  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }
  */

  /**
   * Sign in a user.
   * @param signInRequest The sign in request.
   * @returns The sign in response.
   */
  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.username);

          this.signedInUserType.next(response.role.join(','));

          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role.join(','));

          if(this.signedInUserType.value === 'ROLE_LEADER') {
            this.router.navigate(['/leaders/main']).then();
          }else if (this.signedInUserType.value === 'ROLE_MEMBER') {
            this.detailApiService.getMemberGroup()
              .pipe(
                catchError(err => {
                  if (err.status === 404) {
                    this.router.navigate(['/members/group-search']).then();
                    return of(null);
                  }
                  return of(null);
                })
              )
              .subscribe(group => {
                if (group !== null && group !== undefined) {
                  this.router.navigate(['/members/main']).then();
                }
              });
          }
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInUsername.next('');
          console.error(`Error while signing in: ${error}`);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  /**
   * Sign out a user.
   *
   * This method signs out a user by clearing the token from local storage and navigating to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    this.signedInUserType.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']).then();
  }
}
