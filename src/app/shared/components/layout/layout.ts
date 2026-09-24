import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {IamStore} from '@app/iam/application/iam.store';
import {Sidenav} from '@app/shared/components/sidenav/sidenav';

@Component({
  imports: [
    RouterOutlet,
    Sidenav,
    Sidenav
  ],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  private store = inject(IamStore);

  isSignedIn() {
    return this.store.isSignedIn();
  }

  // Main layout sent to sidenav
  options = signal([
    {link: '/home', label: 'Menú', icon: 'home'},
    {link: '/leader', label: 'Líder', icon: 'assignment_ind'},
    {link: '/member', label: 'Miembro', icon: 'person'}
  ])
}
