import { TaskMember, TaskStatus } from '@app/tasks/model/task.model';

export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string = '',
    public dueDate: string = '',
    public createdAt: string = '',
    public updatedAt: string = '',
    public status: TaskStatus | string = TaskStatus.IN_PROGRESS,
    public member?: TaskMember | null,
    public groupId?: number,
    public userId?: number
  ) {}
}
