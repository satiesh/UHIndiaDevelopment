// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class optionstradetrans {
  constructor(strikeprice?: number, strikeprice2?: number, premiumpaid?: number, expdate?: Date, transtype?: string, selllegexpdate?: Date) {

    this.strikeprice = strikeprice;
    this.strikeprice2 = strikeprice2;
    this.premiumpaid = premiumpaid;
    this.expdate = expdate;
    this.selllegexpdate = selllegexpdate;
    this.transtype = transtype;
  }
  strikeprice: number;
  strikeprice2: number;
  premiumpaid: number;
  expdate: Date;
  selllegexpdate: Date;
  transtype: string;
  toPlainObj(): { strikeprice?: number, strikeprice2?: number, premiumpaid?: number, expdate?: Date, transtype?: string, selllegexpdate?: Date} {
    return Object.assign({}, this);
  }
}
