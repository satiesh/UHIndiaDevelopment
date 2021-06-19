export class investmenttypes {

  constructor(id?: string, Name?: string, createdBy?: string, createdOn?: Date) {
    this.id = id;
    this.Name = Name;
    this.CreatedBy = createdBy;
    this.CreatedOn = createdOn;
  }

  public id: string;
  public Name: string;
  public CreatedBy: string;
  public CreatedOn: Date;
  toPlainObj(): {
    id?: string, Name?: string, createdBy?: string, createdOn?: Date
  } {
    return Object.assign({}, this);
  }
}
