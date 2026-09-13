import { Component } from '@angular/core';
import {RequestApiService} from '@app/requests/services/request-api.service';
import {Request} from '@app/requests/model/request.entity';
import {RequestCardListComponent} from '@app/requests/components/request-card-list/request-card-list.component';

@Component({
  selector: 'app-requests-leader',
  imports: [
    RequestCardListComponent
  ],
  templateUrl: './requests-leader.component.html',
  styleUrl: './requests-leader.component.scss'
})
export class RequestsLeaderComponent {
  constructor(private requestApiService: RequestApiService) {}
  requests: Array<Request> = [];

  private getData() {
    this.requestApiService.getLeaderRequests().subscribe((response: Array<Request>) => {
      this.requests = response.filter(request => request.requestStatus === 'PENDING');
      console.log('Requests fetched successfully:', this.requests);
    }, error => {
      console.error('There was an error fetching requests!', error);
    });
  }

  ngOnInit(): void {
    this.getData();
  }
}
