export class Leader {
  username: string;
  name: string;
  surname: string;
  imgUrl: string;
  email: string;
  averageSolutionTime: string;
  solvedRequests: number;
  constructor (
    username: string,
    name: string,
    surname: string,
    imgUrl: string,
    email: string,
    averageSolutionTime: string,
    solvedRequests: number
  ){
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.imgUrl = imgUrl;
    this.email = email;
    this.averageSolutionTime = averageSolutionTime;
    this.solvedRequests = solvedRequests;
  }
}
