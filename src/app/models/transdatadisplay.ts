export class transdatadisplay {
  constructor(strikeprice?: number, strikeprice2?: number, premiumpaid?: number, transtype?: string, expdate?: Date, selllegexpdate?:Date) {
    this.strikeprice = strikeprice;
    this.strikeprice2 = strikeprice2;
    this.premiumpaid = premiumpaid;
      this.transtype = transtype;
    this.expdate = expdate;
    this.selllegexpdate = selllegexpdate
  }

  strikeprice: number;
  strikeprice2: number;
  premiumpaid: number;
  transtype: string;
  expdate: Date;
  selllegexpdate: Date;
}
