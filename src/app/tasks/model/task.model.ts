export enum TaskStatus {
  ON_HOLD = 'ON_HOLD',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DONE = 'DONE',
  EXPIRED = 'EXPIRED'
}

export interface TaskMember {
  id: number;
  username?: string;
  name: string;
  surname: string;
  urlImage?: string;
  imgUrl?: string;
  email?: string;
}

export interface UpdateTaskResource {
  title: string;
  description: string;
  dueDate: string;
  userId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus | string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  member?: TaskMember | null;
  user?: TaskMember | null;
  groupId?: number;
}
