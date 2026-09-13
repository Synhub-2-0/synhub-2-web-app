import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupMember, Task, TasksApiService} from '@app/tasks/services/tasks-api.service';
import {RequestApiService} from '@app/requests/services/request-api.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {NgForOf, NgIf} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-edit-validation',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './edit-validation.component.html',
  styleUrl: './edit-validation.component.css'
})
export class EditValidationComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksApiService = inject(TasksApiService);
  private requestApiService = inject(RequestApiService);

  taskId!: number;

  title = '';
  description = '';
  memberId: number | undefined;
  dueDateTime = ''; // YYYY-MM-DDTHH:mm para <input type="datetime-local">

  members: GroupMember[] = [];
  loading = true;
  loadingMembers = true;
  saving = false;

  readonly defaultAvatar =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
         <defs><clipPath id="c"><circle cx="32" cy="32" r="32"/></clipPath></defs>
         <g clip-path="url(#c)">
           <rect width="64" height="64" fill="#e5e7eb"/>
           <circle cx="32" cy="24" r="12" fill="#cbd5e1"/>
           <rect x="6" y="40" width="52" height="28" rx="14" fill="#cbd5e1"/>
         </g>
       </svg>`
    );

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('taskId'));
    if (!this.taskId) {
      alert('ID de tarea inválido');
      this.router.navigate(['/leaders/my-group/request-&-validations']);
      return;
    }

    this.tasksApiService.getById(this.taskId).subscribe({
      next: (t: Task) => {
        this.title = t.title ?? '';
        this.description = t.description ?? '';
        this.memberId = t.member?.id ?? (t as any).memberId;

        if (t.dueDate) {
          const d = new Date(t.dueDate);
          const pad = (n: number) => n.toString().padStart(2, '0');
          const yyyy = d.getFullYear();
          const mm = pad(d.getMonth() + 1);
          const dd = pad(d.getDate());
          const hh = pad(d.getHours());
          const mi = pad(d.getMinutes());
          this.dueDateTime = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
        } else {
          this.dueDateTime = '';
        }

        this.loading = false;
      },
      error: () => {
        alert('No se pudo cargar la tarea.');
        this.router.navigate(['/leaders/my-group/request-&-validations']);
      }
    });

    this.tasksApiService.getGroupMembers().subscribe({
      next: (list) => {
        this.members = list ?? [];
        this.loadingMembers = false;
      },
      error: () => {
        this.loadingMembers = false;
        alert('No se pudieron cargar los miembros del grupo.');
      }
    });
  }

  get selectedMember(): GroupMember | undefined {
    return this.members.find(m => m.id === this.memberId);
  }

  imgFor(m?: GroupMember): string {
    return (m?.urlImage && m.urlImage.trim().length > 0) ? m.urlImage : this.defaultAvatar;
  }
  memberLabel(m: GroupMember) { return `${m.name} ${m.surname}`.trim(); }

  save() {
    if (!this.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!this.dueDateTime) {
      alert('La fecha y hora de vencimiento son obligatorias.');
      return;
    }

    this.saving = true;

    const dueISO = new Date(this.dueDateTime).toISOString();

    const payload = {
      title: this.title.trim(),
      description: this.description?.trim() || undefined,
      memberId: this.memberId ?? undefined,
      dueDate: dueISO,
    };

    this.tasksApiService.updateTask(this.taskId, payload).subscribe({
      next: () => {
        this.requestApiService.updateTaskStatus(this.taskId, "IN_PROGRESS").subscribe({
          next: () => {
            this.requestApiService.deleteRequest(
              this.taskId,
              Number(this.route.snapshot.paramMap.get('requestId'))
            ).subscribe({
              next: () => {
                this.router.navigate(['/leaders/my-group/request-&-validations']);
              },
              error: (err) => {
                console.error('Error eliminando solicitud', err);
                alert('No se pudo eliminar la solicitud. Inténtalo de nuevo.');
                this.saving = false;
              }
            });
          },
          error: (err) => {
            console.error('Error actualizando estado de la tarea', err);
            alert('No se pudo actualizar el estado de la tarea. Inténtalo de nuevo.');
            this.saving = false;
          }
        });
      },
      error: (err) => {
        console.error('Error actualizando tarea', err);
        alert('No se pudo actualizar la tarea. Inténtalo de nuevo.');
        this.saving = false;
      }
    });

  }

  cancel() { this.router.navigate(['/leaders/my-group/request-&-validations']); }
}
