import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TasksApiService, GroupMember } from '../../services/tasks-api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css']
})
export class CreateTaskComponent implements OnInit {
  title = '';
  description = '';
  dueDateTime = '';
  memberId: number | undefined;

  members: GroupMember[] = [];
  loadingMembers = false;
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

  private router = inject(Router);
  private api = inject(TasksApiService);

  ngOnInit(): void {
    this.loadingMembers = true;
    this.api.getGroupMembers().subscribe({
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

  save() {
    if (!this.title.trim()) {
      alert('El título es obligatorio.');
      return;
    }
    if (!this.dueDateTime) {
      alert('La fecha y hora de vencimiento son obligatorias.');
      return;
    }
    if (!this.memberId) {
      alert('Debes seleccionar un miembro para asignar la tarea.');
      return;
    }

    this.saving = true;

    const iso = new Date(this.dueDateTime).toISOString();

    this.api.createTaskForMember(this.memberId, {
      title: this.title.trim(),
      description: this.description?.trim() || undefined,
      dueDate: iso
    }).subscribe({
      next: () => this.router.navigate(['/leaders/my-group/tasks']),
      error: () => {
        alert('No se pudo crear la tarea. Intenta nuevamente.');
        this.saving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/leaders/my-group/tasks']);
  }

  imgFor(m?: GroupMember): string {
    return (m?.urlImage && m.urlImage.trim().length > 0) ? m.urlImage : this.defaultAvatar;
  }

  memberLabel(m: GroupMember) {
    return `${m.name} ${m.surname}`.trim();
  }
}
