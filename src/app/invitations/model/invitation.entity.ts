import { GroupReduced, GroupUser } from '@app/groups/model/group.entity';

export interface CreateInvitationRequest {
  userId: number;
  groupId: number;
}

export class Invitation {
  id: number;
  group: GroupReduced;
  user: GroupUser;

  constructor(id: number, group: GroupReduced, user: GroupUser) {
    this.id = id;
    this.group = group;
    this.user = user;
  }

  /** Por si algún componente externo lee .member */
  get member(): GroupUser {
    return this.user;
  }
}
