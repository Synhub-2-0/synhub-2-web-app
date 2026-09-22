import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-no-group-display',
  imports: [],
  templateUrl: './no-group-display.component.html',
  styles: ``
})
export class NoGroupDisplayComponent {

  constructor(public route: Router) {
  }

  goToCreateGroup() {
    this.route.navigate(['leaders/create-group']).then();
  }
}
