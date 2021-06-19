export class usermessaging {

  constructor(remindlater?: boolean, messagetoken?: string, createdOn?: Date, createdBy?: string) {
    this.remindlater = remindlater;
    this.messagetoken = messagetoken;
    this.createdOn = createdOn,
      this.createdBy = createdBy
  }

  public remindlater: boolean;
  public messagetoken: string;
  public createdOn: Date;
  public createdBy: string;

  toPlainObj(): { remindlater?: boolean, messagetoken?: string, createdOn?: Date, createdBy?: string } {
    return Object.assign({}, this);
  }
}
