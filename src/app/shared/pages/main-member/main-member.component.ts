import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsService } from '@app/shared/services/details.service';
import { Member } from '@app/shared/model/member.entity';
import { TaksApiService } from '@app/analytics/services/taks-api.service';

@Component({
  selector: 'app-main-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-member.component.html',
  styleUrl: './main-member.component.css'
})
export class MainMemberComponent implements OnInit {
  private detailsService = inject(DetailsService);
  private taksApiService = inject(TaksApiService);

  member: Member | null = null;
  overview: any = {};
  loadingMetrics: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loadingMetrics = true;
    try {
      const response = await this.detailsService.getMemberDetails().toPromise();
      if (!response) {
        this.loadingMetrics = false;
        return;
      }
      this.member = response as Member;

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
        let memberTaskCount = 0;
        if (Array.isArray(tasks) && tasks.length > 0 && this.member) {
          if ('memberId' in tasks[0]) {
            memberTaskCount = tasks.filter((t: any) => t.memberId === this.member!.id).length;
          } else if ('member' in tasks[0] && typeof tasks[0].member === 'object' && tasks[0].member !== null && 'id' in tasks[0].member) {
            memberTaskCount = tasks.filter((t: any) => t.member && t.member.id === this.member!.id).length;
          } else if ('assignedTo' in tasks[0]) {
            memberTaskCount = tasks.filter((t: any) => t.assignedTo === this.member!.id).length;
          } else if ('userId' in tasks[0]) {
            memberTaskCount = tasks.filter((t: any) => t.userId === this.member!.id).length;
          } else {
            memberTaskCount = tasks.length;
          }
        }
        overview[key] = memberTaskCount;
      });
      await Promise.all(statusPromises);
      this.overview = overview;
    } catch (err) {
      // Manejo de error opcional
    }
    this.loadingMetrics = false;
  }
}
