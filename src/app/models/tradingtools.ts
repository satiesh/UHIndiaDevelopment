export class tradingtools {

  constructor(id?: string, Name?: string, Description?: string, Type?: string, createdBy?: string, createdOn?: Date) {
    this.id = id;
    this.Name = Name;
    this.Description = Description;
    this.Type = Type;
    this.CreatedBy = createdBy;
    this.CreatedOn = createdOn;
  }

  public id: string;
  public Name: string;
  public Description: string;
  public Type: string;
  public CreatedBy: string;
  public CreatedOn: Date;

  toPlainObj(): {
    id?: string, Name?: string, Description?: string, Type?: string, createdBy?: string, createdOn?: Date
  } {
    return Object.assign({}, this);
  }
}
