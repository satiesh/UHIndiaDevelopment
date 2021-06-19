export class useroptiontrades {

  constructor(id?: string, uid?: string, optiontradeid?: string, pinned?: boolean,
    createdOn?: Date, createdBy?: string, takeType?: string, symbol?: string, postedOn?: Date, postedBy?:string) {
    this.id = id;
    this.uid = uid;
    this.optiontradeid = optiontradeid;
    this.pinned = pinned;
    this.takeType = takeType;
    this.symbol = symbol;
    this.createdOn = createdOn;
    this.createdBy = createdBy;
    this.postedOn = postedOn;
    this.postedBy = postedBy;
  }

  public id: string;
  public uid: string;
  public optiontradeid: string;
  public pinned: boolean;
  public symbol: string;
  public takeType: string;
  public createdOn: Date;
  public createdBy: string;
  public postedOn: Date;
  public postedBy: string;

  toPlainObj(): {
    id?: string, uid?: string, optiontradeid?: string, pinned?: boolean,
    createdOn?: Date, createdBy?: string, takeType?: string, symbol?: string, postedOn?: Date, postedBy?: string
  } {
    return Object.assign({}, this);
  }

}
