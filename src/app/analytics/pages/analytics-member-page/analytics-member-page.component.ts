import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsService } from '@app/shared/services/details.service';
import { Member } from '@app/shared/model/member.entity';
import { AnalyticsLeaderApiService } from '../../services/analytics-leader-api.service';
import { AnalyticsMemberComponent } from '../../components/analytics-member/analytics-member.component';
import { MemberApiService } from '../../services/member-api.service';
import { TaksApiService } from '../../services/taks-api.service';

@Component({
  selector: 'app-analytics-member-page',
  standalone: true,
  imports: [CommonModule, AnalyticsMemberComponent],
  templateUrl: './analytics-member-page.component.html',
  styleUrl: './analytics-member-page.component.css'
})
export class AnalyticsMemberPageComponent implements OnInit {
  private detailsService = inject(DetailsService);
  private leaderMetricsService = inject(AnalyticsLeaderApiService);
  private memberApiService = inject(MemberApiService);
  private taksApiService = inject(TaksApiService);

  member: Member | null = null;
  overview: any = {};
  loadingTasks: boolean = false;
  memberTasks: any[] = [];
  rescheduled: any = {};
  avgCompletion: any = {};
  totalInProgressDuration: number = 0;
  inProgressTaskDurations: { taskId: number, title: string, duration: number }[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingTasks = true;
    try {
      const response = await this.detailsService.getMemberDetails().toPromise();
      if (!response) {
        this.loadingTasks = false;
        console.error('No se pudo obtener el detalle del miembro.');
        return;
      }
      this.member = response as Member;
      const memberId = response.id;

      const statusMap: Record<string, string> = {
        completed: 'COMPLETED',
        done: 'DONE',
        inProgress: 'IN_PROGRESS',
        pending: 'ON_HOLD',
        overdue: 'EXPIRED'
      };

      const overview: any = {};
      const statusPromises = Object.entries(statusMap).map(async ([key, status]) => {
        const endpoint = `/api/v1/tasks/status/${status}`;
        const tasks = await this.taksApiService.getTasksByStatus(status).toPromise().catch(() => []);
        console.log(`[Resumen General][${key}] Endpoint consultado: ${endpoint}`);
        console.log(`[Resumen General][${key}] Datos obtenidos:`, tasks);

        let memberTaskCount = 0;
        if (Array.isArray(tasks) && tasks.length > 0 && this.member) {
          console.log(`[Resumen General][${key}] Primer tarea:`, tasks[0]);
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

      this.memberApiService.getTasksForMember(memberId).subscribe(memberTasks => {
        this.memberTasks = Array.isArray(memberTasks) ? memberTasks : [];
        this.loadingTasks = false;

        const inProgressTasks = this.memberTasks.filter(t => t.status === 'IN_PROGRESS');
        this.inProgressTaskDurations = [];
        if (inProgressTasks.length > 0) {
          let durations: number[] = [];
          let completed = 0;
          this.totalInProgressDuration = 0;
          inProgressTasks.forEach(task => {
            console.log(`[Tiempo de Tareas en Progreso] Consultando duración para tarea:`, task.id, task.title);
            this.leaderMetricsService.getInProgressTaskDuration(task.id).subscribe(data => {
              console.log(`[Tiempo de Tareas en Progreso] Respuesta duración tarea ${task.id}:`, data);
              const duration = typeof data.durationInHours === 'number' ? data.durationInHours : 0;
              durations.push(duration);
              this.inProgressTaskDurations.push({
                taskId: task.id,
                title: task.title,
                duration
              });
              completed++;
              if (completed === inProgressTasks.length) {
                this.totalInProgressDuration = durations.reduce((a, b) => a + b, 0);
              }
            }, _ => {
              completed++;
              if (completed === inProgressTasks.length) {
                this.totalInProgressDuration = durations.reduce((a, b) => a + b, 0);
              }
            });
          });
        } else {
          this.totalInProgressDuration = 0;
          this.inProgressTaskDurations = [];
        }
      }, err => {
        this.memberTasks = [];
        this.loadingTasks = false;
        console.error(
          'Error en api/v1/member/tasks: Verifica que la ruta exista en el backend y que el proxy/conf esté correctamente configurado.'
        );
        if (err && err.error) {
          console.error('Error body:', err.error);
        }
      });

      this.leaderMetricsService.getRescheduledTasksForMember(memberId).subscribe(data => {
        const rescheduledData = data as any;
        this.rescheduled = { rescheduled: rescheduledData.value ?? 0 };
      });

      this.leaderMetricsService.getAvgCompletionTimeForMember(memberId).subscribe(data => {
        const avgCompletionData = data as any;
        const minutes = avgCompletionData.value !== undefined ? Math.round(avgCompletionData.value * 24 * 60) : 0;
        this.avgCompletion = { avgDays: minutes };
      });
    } catch (err) {
      this.loadingTasks = false;
      console.error('Error al cargar los datos del miembro:', err);
    }
  }

  formatAvgCompletionTime(minutes: number): string {
    return `${minutes} minutos`;
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
