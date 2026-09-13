export class SignInResponse {
  public id: number;
  public username: string;
  public token: string;
  public role : string[];

  constructor(id: number, username: string, token: string, role: string[]) {
    this.id = id;
    this.username = username;
    this.token = token;
    this.role = role;
  }
}
