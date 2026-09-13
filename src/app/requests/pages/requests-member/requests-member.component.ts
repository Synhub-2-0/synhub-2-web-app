import {Component, computed, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RequestCardListComponent} from "@app/requests/components/request-card-list/request-card-list.component";
import {RequestApiService} from '@app/requests/services/request-api.service';
import {Request} from '@app/requests/model/request.entity';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-requests-member',
  imports: [
    CommonModule,
    RequestCardListComponent,
    FormsModule
  ],
  templateUrl: './requests-member.component.html',
  styleUrl: './requests-member.component.scss'
})
export class RequestsMemberComponent {
  constructor(private requestApiService: RequestApiService) {}
  requests: Array<Request> = [];
  filter = signal<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  statusOptions: Array<'ALL' | 'PENDING' | 'APPROVED'> = ['ALL', 'PENDING', 'APPROVED'];
  selectedFilter: 'ALL' | 'PENDING' | 'APPROVED' = 'ALL';

  onFilterChange(value: 'ALL' | 'PENDING' | 'APPROVED') {
    this.filter.set(value);
    this.selectedFilter = value;
  }

  private allRequests = signal<Request[]>([]);

  filtered = computed(() => {
    const f = this.filter();
    const all = this.allRequests();
    return f === 'ALL' ? all : all.filter(r => r.requestStatus === f);
  });

  private getData() {
    this.requestApiService.getMemberRequests().subscribe((response: Array<Request>) => {
      this.allRequests.set(response);
      this.requests = response; // para compatibilidad con el input actual
    }, error => {
      console.error('There was an error fetching requests!', error);
    });
  }

  ngOnInit(): void {
    this.getData();
  }
}
