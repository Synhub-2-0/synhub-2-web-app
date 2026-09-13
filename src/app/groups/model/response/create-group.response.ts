
export class CreateGroupResponse {
  id: number;
  name: string;
  imgUrl: string;
  description: string;
  code: string;
  memberCount: number;

  constructor(id: number, name: string, imgUrl: string, description: string, code: string, memberCount: number) {
    this.id = id;
    this.name = name;
    this.imgUrl = imgUrl;
    this.description = description;
    this.code = code;
    this.memberCount = memberCount;
  }
}
