export class userdisclaimer {

    constructor(disclaimerId?: string, accepted?:boolean,createdOn?:Date,createdBy?:string) 
        {
        this.disclaimerId = disclaimerId;
        this.accepted = accepted;
        this.createdOn=createdOn,
        this.createdBy=createdBy
        }

    public disclaimerId:string;
    public accepted: boolean;
    public createdOn:Date;
    public createdBy:string;

    toPlainObj(): {disclaimerId?: string, accepted?:boolean,createdOn?:Date,createdBy?:string} {
        return Object.assign({}, this);
    }

  }
