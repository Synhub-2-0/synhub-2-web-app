import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderAnalyticsResource } from '../../models/analytics-leader.entity';

@Component({
  selector: 'app-analytics-leader',
  templateUrl: './analytics-leader.component.html',
  styleUrls: ['./analytics-leader.component.css'],
  imports: [CommonModule]
})
export class AnalyticsLeaderComponent {
  @Input() analytics!: LeaderAnalyticsResource;
  @Input() membersWithRescheduled!: any[];
  @Input() avgCompletionMembers: any[] = [];
  @Input() inProgressDurationsMembers: { name: string, surname: string, imgUrl: string, totalInProgress: number }[] = [];
  @Input() formatInProgressDuration!: (hours: number) => string;

  get safeMembers() {
    return this.analytics?.members ?? [];
  }

  getMemberTaskCount(member: any): number {
    if (!member) return 0;
    if (member.taskCount && typeof member.taskCount === 'number') {
      return member.taskCount;
    }
    if (member.overview && typeof member.overview['TOTAL'] === 'number') {
      return member.overview['TOTAL'];
    }
    if (member.overview) {
      return Object.values(member.overview).reduce((acc: number, v) => acc + (typeof v === 'number' ? v : 0), 0);
    }
    return 0;
  }

  getMaxTaskCount(members: any[] = []): number {
    const arr = (members ?? []).map(m => this.getMemberTaskCount(m));
    return arr.length > 0 ? Math.max(...arr) : 1;
  }

  formatDaysToDuration(days?: number): string {
    if (days == null || days <= 0) return 'Sin tiempo registrado';
    const ms = days * 24 * 60 * 60 * 1000;
    return this.formatDuration(ms);
  }

  formatMinutesToDuration(minutes?: number): string {
    if (minutes == null || minutes <= 0) return 'Sin tiempo registrado';
    const ms = minutes * 60 * 1000;
    return this.formatDuration(ms);
  }

  formatDuration(ms: number): string {
    if (!ms || ms <= 0) return 'Sin tiempo registrado';
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (days > 0) parts.push(`${days} día${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} h`);
    if (minutes > 0) parts.push(`${minutes} min`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} s`);
    return parts.join(' ');
  }
}
