export class questionpdfarray {

  constructor(id?:string,question?: string, result?: string) {
    this.id = id;
    this.question = question;
    this.result = result;
  }

  public id: string;
  public question: string;
  public result: string;


  toPlainObj(): { id?: string, question?: string, result?: string } {
    return Object.assign({}, this);
  }
}
