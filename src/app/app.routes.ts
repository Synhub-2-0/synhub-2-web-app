import { Routes } from '@angular/router';
import {LogInComponent} from './iam/pages/log-in.component/log-in.component';
import {SignUpComponent} from './iam/pages/sign-up/sign-up.component';
import {MainMemberComponent} from './shared/pages/main-member/main-member.component';
import {MainLeaderComponent} from './shared/pages/main-leader/main-leader.component';
import {MainComponent} from './public/pages/main/main.component';
import {authGuard} from './iam/services/auth-guard';
import {MyGroupLeaderComponent} from './groups/pages/my-group-leader/my-group-leader.component';

import {InvitationsLeaderComponent} from './invitations/pages/invitations-leader/invitations-leader.component';
import {RequestsLeaderComponent} from './requests/pages/requests-leader/requests-leader.component';
import {TasksLeaderComponent} from './tasks/pages/tasks-leader/tasks-leader.component';
import {MyGroupMemberComponent} from './groups/pages/my-group-member/my-group-member.component';
import {TasksMemberComponent} from './tasks/pages/tasks-member/tasks-member.component';
import {RequestsMemberComponent} from './requests/pages/requests-member/requests-member.component';
import {AnalyticsMemberPageComponent} from './analytics/pages/analytics-member-page/analytics-member-page.component';
import {InvitationMemberComponent} from './invitations/pages/invitation-member/invitation-member.component';
import {AnalyticsLeaderPageComponent } from './analytics/pages/analytics-leader-page/analytics-leader-page.component';
import {CreateGroupComponent} from '@app/groups/pages/create-group/create-group.component';
import {MembersLeaderComponent} from '@app/groups/pages/members-leader/members-leader.component';
import {TaskMemberDetailsComponent} from '@app/groups/components/task-member-details/task-member-details';
import {CreateTaskComponent} from '@app/tasks/pages/create-task/create-task';
import {EditTaskComponent} from '@app/tasks/pages/edit-task/edit-task';
import {ViewTaskComponent} from '@app/tasks/pages/view-task/view-task';
import {CommentTaskComponent} from '@app/tasks/pages/comment-task/comment-task';
import {ValidationPageComponent} from '@app/requests/pages/validation-page/validation-page.component';
import {EditValidationComponent} from '@app/requests/pages/edit-validation/edit-validation.component';

export const routes: Routes = [
  {path: '', component: MainComponent, canActivate:[authGuard]},
  { path: 'sign-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'members/main', component: MainMemberComponent },
  { path: 'leaders/main', component: MainLeaderComponent },
  { path: 'leaders/my-group', component: MyGroupLeaderComponent },
  { path: 'leaders/my-group/members', component: MembersLeaderComponent },
  { path: 'leaders/my-group/members/:memberId/tasks', component: TaskMemberDetailsComponent },
  { path: 'leaders/create-group', component: CreateGroupComponent },
  { path: 'leaders/my-group/invitations', component: InvitationsLeaderComponent },
  { path: 'leaders/my-group/request-&-validations', component: RequestsLeaderComponent },
  { path: 'leaders/my-group/task/:taskId/request/:requestId', component: ValidationPageComponent },
  { path: 'leaders/tasks/:taskId/validation/edit/request/:requestId', component: EditValidationComponent},
  { path: 'leaders/my-group/tasks', component: TasksLeaderComponent },
  { path: 'members/my-group/tasks', component: TasksMemberComponent },

  { path: 'leaders/my-group/tasks/create', component: CreateTaskComponent },
  { path: 'leaders/my-group/tasks/:id/edit', component: EditTaskComponent },
  { path: 'leaders/my-group/tasks/:id', component: ViewTaskComponent },
  { path: 'members/my-group/tasks/:id', component: ViewTaskComponent },
  { path: 'members/my-group/tasks/:id/comment', component: CommentTaskComponent },


  { path: 'leaders/my-group/analytics', component: AnalyticsLeaderPageComponent },
  { path: 'members/my-group', component: MyGroupMemberComponent },

  { path: 'members/my-group/request-&-validations', component: RequestsMemberComponent},
  { path: 'members/my-group/analytics', component: AnalyticsMemberPageComponent },
  { path: 'members/group-search', component: InvitationMemberComponent },

  { path: '**', redirectTo: '' }
];
