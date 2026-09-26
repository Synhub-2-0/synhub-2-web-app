export type RoleInGroup = 'GROUP_LEADER' | 'GROUP_MEMBER';

export interface GroupUser {
  id: number;
  username: string;
  name: string;
  surname: string;
  imgUrl: string;
  email: string;
  accountRoles: string[];
}

export interface UserInGroup {
  user: GroupUser;
  roleInGroup: RoleInGroup;
}

export class Group {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  code: string;
  memberCount?: number;
  usersInGroup: UserInGroup[];

  constructor(
    id: number,
    name: string,
    imgUrl: string,
    description: string,
    code: string,
    memberCount: number = 0,
    usersInGroup: UserInGroup[] = []
  ) {
    this.id = id;
    this.name = name;
    this.imgUrl = imgUrl;
    this.description = description;
    this.code = code;
    this.memberCount = memberCount;
    this.usersInGroup = usersInGroup;
  }
}

export interface GroupReduced {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  code: string;
  memberCount: number;
  leader: GroupUser;
}
