export class TStockTradeDatum {
  Id: number
  StockOfTheDay:boolean
  TradeDataId: number
  CurrentStockPrice: number
  AboveResistance: string
  BelowResistance: string
  StopLoss: number
  Support: number
  StockSellPrice: number
  StockExitDate:Date
  IsStockActive: boolean
  CreatedOn: Date
  CreatedBy: string
}
