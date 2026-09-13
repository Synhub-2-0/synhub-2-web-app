
import {ShortMember} from '@app/shared/model/short-member.entity';

export class MemberGroup {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  code: string;
  members: ShortMember[];

  constructor(id: number, name: string, imgUrl: string, description: string, code: string, members: ShortMember[]) {
    this.id = id;
    this.name = name;
    this.imgUrl = imgUrl;
    this.description = description;
    this.code = code;
    this.members = members;
  }

}
