import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '@env/environment';

export type TaskStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'ON_HOLD' | 'DONE';

export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public dueDate: string,
    public createdAt: string,
    public updatedAt: string,
    public status: TaskStatus,
    public member: {
      id: number;
      name: string;
      surname: string;
      urlImage: string;
    },
    public groupId: number
  ) {}
}
@Component({
  selector: 'app-task-member-details',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './task-member-details.component.html',
  styleUrl: './task-member-details.component.css'
})
export class TaskMemberDetailsComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus: string = 'ALL';
  statusOptions: TaskStatus[] = ['IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'ON_HOLD', 'DONE'];
  memberId!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.memberId = Number(this.route.snapshot.paramMap.get('memberId'));
    if (this.memberId) {
      this.http.get<Task[]>(`${environment.baseUrl}/members/${this.memberId}/tasks`)
        .subscribe({
          next: (tasks) => {
            this.tasks = tasks;
            this.filtrar();
          },
          error: (err) => console.error('Error al obtener tareas del miembro', err)
        });
    }
  }

  filtrar() {
    if (this.selectedStatus === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === this.selectedStatus);
    }
  }

  getColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return '#00c85a'; // verde
      case 'IN_PROGRESS': return '#00c85a';
      case 'EXPIRED': return '#fa2e2e'; // rojo
      case 'ON_HOLD': return '#ffd43b'; // amarillo
      case 'DONE': return '#1e88e5'; // azul
      default: return '#ecf0f1';
    }
  }
}
