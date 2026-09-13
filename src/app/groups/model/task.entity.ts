export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public dueDate: string,
    public createdAt: string,
    public updatedAt: string,
    public status: string,
    public member: {
      id: number;
      name: string;
      surname: string;
      urlImage: string;
    },
    public groupId: number
  ) {}
}
