export class userroles {
    constructor(rolename?: string, createdOn?:Date,createdBy?:string) 
        {
        this.roleName = rolename;
        this.createdOn=createdOn,
        this.createdBy=createdBy
        }

    public roleName:string;
    public createdOn:Date;
    public createdBy:string;

    toPlainObj(): {rolename?: string, createdOn?:Date,createdBy?:string} {
        return Object.assign({}, this);
    }
}
