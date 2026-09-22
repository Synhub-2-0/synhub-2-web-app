import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-no-group-member-display',
  imports: [],
  templateUrl: './no-group-member-display.component.html',
  styles: ``
})
export class NoGroupMemberDisplayComponent {

  constructor(public route: Router) {
  }

  goToSearchGroup() {
    //TODO: implement search group route redirection
  }

}
