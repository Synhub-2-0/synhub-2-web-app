import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsApiService } from '../../services/groups-api.service';
import { AnalyticsLeaderApiService } from '../../services/analytics-leader-api.service';
import { LeaderAnalyticsResource } from '../../models/analytics-leader.entity';
import {AnalyticsLeaderComponent} from '../../components/analytics-leader/analytics-leader.component';
import { MemberApiService } from '../../services/member-api.service';
import { TaksApiService } from '../../services/taks-api.service';

@Component({
  selector: 'app-analytics-leader-page-page',
  templateUrl: './analytics-leader-page.component.html',
  styleUrls: ['./analytics-leader-page.component.css'],
  imports: [CommonModule, AnalyticsLeaderComponent]
})
export class AnalyticsLeaderPageComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;

  private groupsService = inject(GroupsApiService);
  private analyticsService = inject(AnalyticsLeaderApiService);
  private memberService = inject(MemberApiService);
  private taksApiService = inject(TaksApiService);

  analyticsResource: LeaderAnalyticsResource = new LeaderAnalyticsResource(
    {} as any,
    [],
    {},
    [],
    {},
    {},
    {}
  );

  membersWithRescheduled: any[] = [];
  avgCompletionMembers: any[] = [];
  inProgressDurationsMembers: { name: string, surname: string, imgUrl: string, totalInProgress: number }[] = [];

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      const membersData = await this.groupsService.getAllGroupMembers().toPromise();
      if (!membersData || (membersData.error && membersData.status)) {
        this.error = 'No se pudieron cargar los miembros del grupo (respuesta inválida).';
        this.loading = false;
        return;
      }

      const members = Array.isArray(membersData) ? membersData : (membersData?.result ?? []);
      if (!Array.isArray(members) || members.length === 0) {
        this.error = 'No se encontraron miembros en el grupo.';
        this.loading = false;
        return;
      }

      this.analyticsResource.members = members;

      // Usar getTasksByStatus para el resumen general
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

      let leaderTasks: any[] = [];
      let avgCompletionSum = 0;
      let avgCompletionCount = 0;
      let rescheduledSum = 0;
      let timePassedSumMs = 0;
      this.inProgressDurationsMembers = [];

      const metricPromises = members.map(async (member: any) => {
        const memberId = member.id;
        const memberTasks = await this.memberService.getTasksForMember(memberId).toPromise().catch(() => []);
        const taskCount = Array.isArray(memberTasks) ? memberTasks.length : 0;
        leaderTasks.push({
          memberName: member.name + ' ' + member.surname,
          imgUrl: member.imgUrl,
          taskCount: taskCount,
          title: member.title
        });

        const avgData = await this.analyticsService.getAvgCompletionTimeForMember(memberId).toPromise().catch(() => ({}));
        if (avgData?.value !== undefined) {
          const avgMinutes = Math.round(avgData.value * 24 * 60);
          avgCompletionSum += avgMinutes;
          avgCompletionCount++;
          this.avgCompletionMembers.push({
            name: member.name,
            surname: member.surname,
            imgUrl: member.imgUrl,
            avgMinutes: avgMinutes
          });
        }

        const rescheduledData = await this.analyticsService.getRescheduledTasksForMember(memberId).toPromise().catch(() => ({}));
        rescheduledSum += rescheduledData?.value ?? 0;
        member.rescheduledCount = rescheduledData?.value ?? 0;

        const timePassedData = await this.analyticsService.getTaskTimePassedForMember(memberId).toPromise().catch(() => ({}));
        timePassedSumMs += timePassedData?.timePassed ?? 0;

        const memberTasksInProgress = await this.memberService.getTasksForMember(memberId).toPromise().catch(() => []);
        let totalInProgress = 0;
        if (Array.isArray(memberTasksInProgress)) {
          const inProgressTasks = memberTasksInProgress.filter((t: any) => t.status === 'IN_PROGRESS');
          if (inProgressTasks.length > 0) {
            const durations = await Promise.all(
              inProgressTasks.map(async (task: any) => {
                const data = await this.analyticsService.getInProgressTaskDuration(task.id).toPromise().catch(() => null);
                return data && typeof data.durationInHours === 'number' ? data.durationInHours : 0;
              })
            );
            totalInProgress = durations.reduce((a, b) => a + b, 0);
          }
        }
        this.inProgressDurationsMembers.push({
          name: member.name,
          surname: member.surname,
          imgUrl: member.imgUrl,
          totalInProgress
        });
      });

      await Promise.all(metricPromises);

      this.membersWithRescheduled = members.filter(m => m.rescheduledCount && m.rescheduledCount > 0);

      this.analyticsResource.overview = overview;
      this.analyticsResource.leaderTasks = leaderTasks;
      const avgMinutes = avgCompletionCount ? Math.round(avgCompletionSum / avgCompletionCount) : 0;
      this.analyticsResource.avgCompletion = {
        avgDays: avgMinutes
      };
      this.analyticsResource.rescheduled = { rescheduled: rescheduledSum };
      this.analyticsResource.timePassed = { timePassed: Math.round(timePassedSumMs / 60000) }; // Suma en minutos
      this.avgCompletionMembers = this.avgCompletionMembers;

      this.loading = false;
    } catch (err) {
      this.error = 'No se pudieron cargar los miembros del grupo.';
      this.loading = false;
    }
  }

  formatInProgressDuration(hours: number): string {
    if (hours < 1) {
      const mins = Math.round(hours * 60);
      return `${mins} minutos`;
    }
    const days = Math.floor(hours / 24);
    const remHours = Math.floor(hours % 24);
    let result = '';
    if (days > 0) {
      result += `${days} ${days === 1 ? 'día' : 'días'}`;
    }
    if (remHours > 0) {
      if (result.length > 0) result += ' ';
      result += `${remHours} ${remHours === 1 ? 'hora' : 'horas'}`;
    }
    if (result === '') {
      result = '0 horas';
    }
    return result;
  }
}
