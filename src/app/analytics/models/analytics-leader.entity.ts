import { Leader } from '../../shared/model/leader.entity';
import { Member } from '../../shared/model/member.entity';

export class LeaderAnalyticsResource {
  leader: Leader;
  members: Member[];
  overview: {
    completed?: number;
    done?: number;
    inProgress?: number;
    pending?: number;
    overdue?: number;
    [key: string]: number | undefined;
  };
  leaderTasks: {
    memberName: string;
    imgUrl?: string;
    taskCount: number;
    title?: string;
  }[];
  avgCompletion?: { avgDays?: number };
  rescheduled?: { rescheduled?: number };
  timePassed?: { timePassed?: number };

  constructor(
    leader: Leader,
    members: Member[],
    overview: any = {},
    leaderTasks: any[] = [],
    avgCompletion: any = {},
    rescheduled: any = {},
    timePassed: any = {}
  ) {
    this.leader = leader;
    this.members = members;
    this.overview = overview;
    this.leaderTasks = leaderTasks;
    this.avgCompletion = avgCompletion;
    this.rescheduled = rescheduled;
    this.timePassed = timePassed;
  }
}
