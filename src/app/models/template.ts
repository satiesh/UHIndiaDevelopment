// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class template {

  constructor(id?: string, name?: string, description?: string, isactive?: boolean, createdBy?: string, createdOn?: Date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isactive = isactive;
    this.CreatedBy = createdBy;
    this.CreatedOn = createdOn;
  }

  public id: string;
  public name: string;
  public description: string;
  public isactive: boolean;
  public CreatedBy: string;
  public CreatedOn: Date;

  toPlainObj(): {
    id?: string, name?: string, description?: string, isactive?: boolean, createdBy?: string, createdOn?: Date
  } {
    return Object.assign({}, this);
  }
}
