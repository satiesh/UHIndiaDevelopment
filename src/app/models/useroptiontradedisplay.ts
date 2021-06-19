import { optionstradenotes } from './optionstradenotes';
import { optionstradetrans } from './optionstradetrans';

export class useroptiontradedisplay {
  constructor(id?: string, symbol?: string, createdby?: string, createdon?: Date, pinned?:boolean ,notes?: optionstradenotes[], postedby?: string, trans?: optionstradetrans[], type?: string, isactive?: boolean) {
    this.id = id;
    this.symbol = symbol;
    this.createdby = createdby;
    this.createdon = createdon;
    this.pinned= pinned;
    this.notes = notes;
    this.postedby = postedby;
    this.trans = trans;
    this.type = type;
    this.isactive = isactive;

  }
  id: string;
  symbol: string;
  createdby: string;
  createdon: Date;
  pinned: boolean;
  notes: optionstradenotes[];
  postedby: string;
  trans: optionstradetrans[];
  type: string;
  isactive: boolean;
  useroptiontradeid: string;
}
