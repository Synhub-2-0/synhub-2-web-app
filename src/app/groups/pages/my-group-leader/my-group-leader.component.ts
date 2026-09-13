import { Component } from '@angular/core';
import {GroupDisplayComponent} from '@app/groups/components/group-display/group-display.component';

@Component({
  selector: 'app-my-group-leader',
  imports: [
    GroupDisplayComponent
  ],
  template: `
    <app-group-display/>
  `,
  styleUrl: './my-group-leader.component.css'
})
export class MyGroupLeaderComponent {

}
