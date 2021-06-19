// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { optionstradetrans } from './optionstradetrans';
import { optionstradenotes } from './optionstradenotes';

export class optionstrade {
  total: number;
  historyDate: any;
  constructor(id?: string, symbol?: string, spread?: string, createdby?: string, createdon?: Date, notes?: optionstradenotes[], postedby?: string,
    trans?: optionstradetrans[], type?: string, isactive?: boolean, currentStockPrice?: string, aboveResistance?: string, belowResistance?: string, stocknotes?: optionstradenotes[],
    stopLoss?: string, support?: string, postedFor?: string, isstockactive?: boolean, isoptionactive?: boolean,
    optionsellprice?: string, optionexitdate?: Date, stocksellprice?: string, stockexitdate?: Date, broadcastTrade?: boolean, stockoftheday?:boolean) {
    this.id = id;
    this.symbol = symbol;
    this.spread = spread;
    this.broadcastTrade = broadcastTrade;
    this.createdby = createdby;
    this.createdon = createdon;
    this.notes = notes;
    this.postedby = postedby;
    this.trans = trans;
    this.type = type;
    this.isactive = isactive;
    this.currentStockPrice = currentStockPrice;
    this.aboveResistance = aboveResistance;
    this.belowResistance = belowResistance;
    this.stocknotes = stocknotes;
    this.stopLoss = stopLoss;
    this.support = support;
    this.postedFor = postedFor;
    this.isoptionactive = isoptionactive;
    this.isstockactive = isstockactive;
    this.optionsellprice = optionsellprice;
    this.optionexitdate = optionexitdate;
    this.stocksellprice = stocksellprice;
    this.stockexitdate = stockexitdate;
    this.stockoftheday = stockoftheday;
  }

  id: string;
  symbol: string;
  spread: string;
  broadcastTrade: boolean;
  createdby: string;
  createdon: Date;
  notes: optionstradenotes[];
  postedby: string;
  trans: optionstradetrans[];
  type: string;
  isactive: boolean;
  currentStockPrice: string;
  aboveResistance: string;
  belowResistance: string;
  stocknotes: optionstradenotes[];
  stopLoss: string;
  support: string;
  postedFor: string;
  isoptionactive: boolean;
  isstockactive: boolean;
  stockoftheday: boolean;
  optionsellprice: string;
  optionexitdate: Date;
  stocksellprice: string;
  stockexitdate: Date;

  toPlainObj(): {
    id?: string, symbol?: string, spread?: string, createdby?: string, createdon?: Date, notes?: optionstradenotes[],
    postedby?: string, trans?: optionstradetrans[], type?: string, isactive?: boolean, currentStockPrice?: string, aboveResistance?: string,
    belowResistance?: string, stocknotes?: optionstradenotes[],
    stopLoss?: string, support?: string, postedFor?: string, isstockactive?: boolean, isoptionactive?: boolean,
    optionsellprice?: string, optionexitdate?: Date, stocksellprice?: string, stockexitdate?: Date, broadcastTrade?: boolean, stockoftheday?:boolean
  } {
    return Object.assign({}, this);
  }
}
