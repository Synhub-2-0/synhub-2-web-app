import {Component, Input} from '@angular/core';
import {Request} from '@app/requests/model/request.entity';
import {RequestCardComponent} from '@app/requests/components/request-card.component/request-card.component';
import {RequestApiService} from '@app/requests/services/request-api.service';

@Component({
  selector: 'app-request-card-list',
  imports: [
    RequestCardComponent
  ],
  templateUrl: './request-card-list.component.html',
  styleUrl: './request-card-list.component.css'
})
export class RequestCardListComponent {
  @Input()requests: Array<Request> = [];

  constructor(private requestApi: RequestApiService) {
  }


}
