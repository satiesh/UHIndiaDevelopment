import { TOpstkTradeDatum } from './topstktradedatum'
import { TOptionTradeDatum } from './toptiontradedatum'
import { TOptionTradeNote } from './toptiontradenote'
import { TStockTradeNote } from './tstocktradenote'
import { TStockTradeDatum } from './tstocktradedatum'

export class TradeData {
  TOpstkTradeDatum: TOpstkTradeDatum
  TOptionTradeDatum: TOptionTradeDatum
  TOptionTradeNote: TOptionTradeNote
  TStockTradeDatum: TStockTradeDatum
  TStockTradeNote: TStockTradeNote
  FBRefId: string
}
