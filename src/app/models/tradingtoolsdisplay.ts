export class tradingtoolsdisplay {

  constructor(id?: string, Name?: string, Description?: string, Type?: string, IsActive?: boolean) {
    this.id = id;
    this.Name = Name;
    this.Description = Description;
    this.Type = Type;
    this.IsActive= IsActive;
  }

  public id: string;
  public Name: string;
  public Description: string;
  public Type: string;
  public IsActive: boolean;
  

  toPlainObj(): {id?: string, Name?: string, Description?: string, Type?: string, IsActive?: boolean}
  {
    return Object.assign({}, this);
  }
}
