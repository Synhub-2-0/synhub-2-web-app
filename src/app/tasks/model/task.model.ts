export enum TaskStatus {
  ON_HOLD = 'ON_HOLD',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DONE = 'DONE',
  EXPIRED = 'EXPIRED'
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
