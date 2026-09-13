export interface TaskOverviewResource {
  type: string;
  totalTasks: number;
  details: { [status: string]: number };
}

export interface TaskDistributionResource {
  type: string;
  totalTasks: number;
  tasks: Array<{ title: string }>;
}

export interface RescheduledTasksResource {
  type: string;
  value: number;
}

export interface AvgCompletionTimeResource {
  type: string;
  value: number;
}
