import { channelgroup } from './channelgroup';

// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class channel {
  constructor(id?: string, createdby?: string, createdon?: Date, accountsid?: string, authtoken?: string, channelgroup?: channelgroup[], membergroup?:string) {
    this.id = id;
    this.createdby = createdby;
    this.createdon = createdon;
    this.accountsid = accountsid;
    this.authtoken = authtoken;
    this.name = name;
    this.membergroup = membergroup;
    this.channelgroup = channelgroup;
  }
  id: string;
  createdby: string;
  createdon: Date;
  accountsid: string;
  authtoken: string;
  name: string;
  membergroup: string;
  channelgroup: channelgroup[];

  toPlainObj(): { id?: string, createdby?: string, createdon?: Date, accountsid?: string, authtoken?: string, channelgroup?: channelgroup[], membergroup?: string } {
    return Object.assign({}, this);
  }

}
