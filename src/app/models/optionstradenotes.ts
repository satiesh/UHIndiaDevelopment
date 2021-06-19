// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class optionstradenotes {
  constructor(notestype?: string, notesvalue?: string, createdon?: Date, notespostedby?: string, fbid?: string) {
    this.notestype = notestype;
    this.notesvalue = notesvalue;
    this.createdon = createdon;
    this.notespostedby = notespostedby;
    this.fbid = fbid;
  }

  fbid: string;
   notestype: string;
  notesvalue: string;
  createdon: Date;
  notespostedby: string;
  toPlainObj(): { notestype?: string, notesvalue?: string, createdon?: Date, notespostedby?: string, fbid?: string} {
    return Object.assign({}, this);
  }
}
