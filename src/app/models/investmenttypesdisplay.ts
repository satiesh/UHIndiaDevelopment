export class investmenttypesdisplay {

  constructor(id?: string, Name?: string, IsActive?: boolean) {
    this.id = id;
    this.Name = Name;
    this.IsActive = IsActive;
  }

  public id: string;
  public Name: string;
  public IsActive: boolean;
  toPlainObj(): {
    id?: string, Name?: string, IsActive?: boolean
  } {
    return Object.assign({}, this);
  }
}
