export class userquestions {

  constructor(questionid?: string, accepted?: boolean, createdOn?: Date, createdBy?: string) {
    this.questionid = questionid;
    this.accepted = accepted;
    this.createdOn = createdOn,
      this.createdBy = createdBy
  }

  public questionid: string;
  public accepted: boolean;
  public createdOn: Date;
  public createdBy: string;

  toPlainObj(): { questionid?: string, accepted?: boolean, createdOn?: Date, createdBy?: string } {
    return Object.assign({}, this);
  }

}
