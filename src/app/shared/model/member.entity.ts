export class Member{
  id: number;
  username: string;
  name: string;
  surname: string;
  imgUrl: string;
  email: string;
  constructor(
    id: number,
    username: string,
    name: string,
    surname: string,
    imgUrl: string,
    email: string,
  ) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.imgUrl = imgUrl;
    this.email = email;
  }
}
