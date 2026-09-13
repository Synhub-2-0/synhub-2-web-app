
export class CreateGroupRequest {
  name: string;
  imgUrl: string;
  description: string;

  constructor(name: string, imgUrl: string, description: string) {
    this.name = name;
    this.imgUrl = imgUrl;
    this.description = description;
  }
}
