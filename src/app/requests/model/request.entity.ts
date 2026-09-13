import {Task} from '@app/shared/model/task.entity';

export class Request{
  id: number;
  description: string;
  requestType: string;
  requestStatus: string;
  task: Task;
  groupId: number;
  constructor(
    id: number,
    description: string,
    requestType: string,
    requestStatus: string,
    task: Task,
    groupId: number
  ) {
    this.id = id;
    this.description = description;
    this.requestType = requestType;
    this.requestStatus = requestStatus;
    this.task = task;
    this.groupId = groupId;
  }
}

