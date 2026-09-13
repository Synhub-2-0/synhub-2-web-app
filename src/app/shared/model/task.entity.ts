export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  OVERDUE = 'OVERDUE'
}

export interface TaskMember {
  id: number;
  name: string;
  surname: string;
  urlImage: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus | string;
  dueDate?: string;       // ISO
  createdAt?: string;
  updatedAt?: string;
  member?: TaskMember | null;
  groupId?: number;
}
