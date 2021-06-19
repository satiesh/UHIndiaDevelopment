// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
export class questions {
  constructor(id?: string, question?: string, createdby?: string, createdon?: Date,isactive?: boolean) {
    this.id = id;
    this.question = question;
    this.createdby = createdby;
    this.createdon = createdon;
    this.isactive = isactive;

  }

  id: string;
  question: string;
  createdby: string;
  createdon: Date;
  isactive: boolean;

  toPlainObj(): { id?: string, question?: string, createdby?: string, createdon?: Date, isactive?: boolean} {
    return Object.assign({}, this);
  }
}
