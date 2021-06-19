// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class Roles {
  constructor(RoleName?: string, RoleDescription?: string, Permission?: string, IsActive?: boolean, CreatedOn?: Date, CreatedBy?: string) {
    this.RoleName=RoleName;
    this.RoleDescription = RoleDescription;
    this.Permission = Permission;
    this.IsActive = IsActive;
    this.CreatedOn = CreatedOn;
    this.CreatedBy = CreatedBy;
  }
  id: string;
  RoleName: string;
  RoleDescription: string;
  Permission: string;
  IsActive: boolean;
  CreatedOn: Date;
  CreatedBy: string;

  toPlainObj(): {
    RoleName?: string, RoleDescription?: string,
    Permission?: string, IsActive?: boolean,
    CreatedOn?: Date, CreatedBy?: string
  } {
    return Object.assign({}, this);
  }

}
