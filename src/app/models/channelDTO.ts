// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class channelDTO {
  constructor(id?: string, createdby?: string, createdon?: Date, accountsid?: string, authtoken?: string, name?: string, membergroup?: string) {
    this.id = id;
    this.createdby = createdby;
    this.createdon = createdon;
    this.accountsid = accountsid;
    this.authtoken = authtoken;
    this.membergroup = membergroup;
    this.name = name;
  }
  id: string;
  createdby: string;
  createdon: Date;
  accountsid: string;
  authtoken: string;
  membergroup: string;
  name: string;
 

  toPlainObj(): { id?: string, createdby?: string, createdon?: Date, accountsid?: string, authtoken?: string, name?: string, membergroup?: string} {
    return Object.assign({}, this);
  }

}
