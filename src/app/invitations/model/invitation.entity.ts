import {Member} from '../../shared/model/member.entity';
import {Group} from '../../groups/model/group.entity';

export class Invitation{
  id: number;
  member: Member;
  group: Group;
  constructor(
    id: number,
    member: Member,
    group: Group
  ) {
    this.id = id;
    this.member = member;
    this.group = group;
  }
}
