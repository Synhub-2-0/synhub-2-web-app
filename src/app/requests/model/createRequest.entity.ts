export class CreateRequest {
  description: string;
  requestType: string;
  constructor(
    description: string,
    requestType: string
  ) {
    this.description = description;
    this.requestType = requestType;
  }
}
