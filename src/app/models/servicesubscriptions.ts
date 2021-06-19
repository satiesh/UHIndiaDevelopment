
export class ServiceSubscription {
  constructor(Name?: string, Description?: string, Price?: number, IsActive?: boolean, CreatedOn?: Date, CreatedBy?: string, GroupName?:string) {
    this.Name = Name;
    this.Description = Description;
    this.Price = Price;
    this.IsActive = IsActive;
    this.CreatedOn = CreatedOn;
    this.GroupName = GroupName;
    this.CreatedBy = CreatedBy;
  }
  id?: string;
  Name: string;
  Description: string;
  GroupName: string;
  Price: number;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;

  toPlainObj(): {
    Name?: string, Description?: string, Price?: number,
    IsActive?: boolean, CreatedOn?: Date, CreatedBy?: string, GroupName?: string
  } {
    return Object.assign({}, this);
  }

}
