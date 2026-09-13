import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsApiService } from '@app/analytics/services/groups-api.service';
import { TaksApiService } from '@app/analytics/services/taks-api.service';

@Component({
  selector: 'app-main-leader',
  imports: [CommonModule],
  templateUrl: './main-leader.component.html',
  styleUrl: './main-leader.component.css'
})
export class MainLeaderComponent implements OnInit {
  private groupsService = inject(GroupsApiService);
  private taksApiService = inject(TaksApiService);

  loadingMetrics: boolean = false;
  overview: any = {};
  members: any[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingMetrics = true;
    try {
      const membersData = await this.groupsService.getAllGroupMembers().toPromise();
      this.members = Array.isArray(membersData) ? membersData : (membersData?.result ?? []);

      const statusMap: Record<string, string> = {
        completed: 'COMPLETED',
        done: 'DONE',
        inProgress: 'IN_PROGRESS',
        pending: 'ON_HOLD',
        overdue: 'EXPIRED'
      };

      const overview: any = {};
      const statusPromises = Object.entries(statusMap).map(async ([key, status]) => {
        const tasks = await this.taksApiService.getTasksByStatus(status).toPromise().catch(() => []);
        overview[key] = Array.isArray(tasks) ? tasks.length : 0;
      });
      await Promise.all(statusPromises);

      this.overview = overview;
    } catch (err) {
      // Manejo de error opcional
    }
    this.loadingMetrics = false;
  }
}
