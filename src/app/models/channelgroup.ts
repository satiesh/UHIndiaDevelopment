// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
export class channelgroup {
  constructor(id?: string, isactive?: boolean, name?: string, uniqueid?: string) {
    this.id = id;
    this.isactive = isactive;
    this.name = name;
    this.uniqueid = uniqueid;
  }
  id: string;
  isactive: boolean;
  name: string;
  uniqueid: string;

  toPlainObj(): { id?:string, isactive?: boolean, name?: string, uniqueid?: string }
  {
    return Object.assign({}, this);
  }
}
