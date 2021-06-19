// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class dailyticker {
  constructor(id?: string,createdby?: string,createdon?: Date,marketcap?: string,
    notes?: string,quote?: string,resistancetarget?: string,sector?: string,
    stoploss?: string,support?: string,symbol?: string,tradingpricerange?: string,
    type?: string, volume?: string, isactive?:boolean
  ) {
    this.id = id;
    this.createdby = createdby
    this.createdon = createdon
    this.marketcap = marketcap
    this.notes = notes
    this.quote = quote
    this.resistancetarget = resistancetarget
    this.sector = sector
    this.stoploss = stoploss
    this.support = support
    this.symbol = symbol
    this.tradingpricerange = tradingpricerange
    this.type = type
    this.volume = volume
    this.isactive=isactive
  }
  id: string;
  createdby: string;
  createdon: Date;
  marketcap: string;
  notes: string;
  quote: string;
  resistancetarget: string;
  sector: string;
  stoploss: string;
  support: string;
  symbol: string;
  tradingpricerange: string;
  type: string;
  volume: string;
  isactive: boolean;

  toPlainObj(): {
    id?: string, createdby?: string, createdon?: Date, marketcap?: string,
    notes?: string, quote?: string, resistancetarget?: string, sector?: string,
    stoploss?: string, support?: string, symbol?: string, tradingpricerange?: string,
    type?: string, volume?: string, isactive?: boolean
  } {
    return Object.assign({}, this);
  }

}
