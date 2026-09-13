import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginEventService {
  private loginSuccessSource = new Subject<void>();
  loginSuccess$ = this.loginSuccessSource.asObservable();

  emitLoginSuccess() {
    this.loginSuccessSource.next();
  }
}
