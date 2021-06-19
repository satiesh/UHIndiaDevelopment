// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
export class coupons {
  constructor(id?: string, createdby?: string, createdon?: Date, expiresOn?: Date, isactive?: boolean, name?: string, type?: string, value?: number, discounteditem?:string) {
    this.id = id;
    this.createdby = createdby;
    this.createdon = createdon;
    this.discounteditem = discounteditem;
    this.expiresOn = expiresOn;
    this.isactive = isactive;
    this.name = name;
    this.type = type;
    this.value = value;
  }
  id: string;
  createdby: string;
  discounteditem: string;
  createdon: Date;
  expiresOn: Date;
  isactive: boolean;
  name: string;
  type: string;
  value: number;

  toPlainObj(): { id?: string, createdby?: string, createdon?: Date, expiresOn?: Date, isactive?: boolean, name?: string, type?: string, value?: number } {
    return Object.assign({}, this);
  }
}
