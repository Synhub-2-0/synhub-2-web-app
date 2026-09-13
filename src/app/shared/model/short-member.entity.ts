
export class ShortMember {
  id: number;
  username: string;
  name: string;
  surname: string;
  imgUrl: string;

  constructor(id: number, username: string, name: string, surname: string, imgUrl: string) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.imgUrl = imgUrl;
  }
}
