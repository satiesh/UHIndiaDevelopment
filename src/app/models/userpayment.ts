export class userpayment {

  constructor(itemReferenceId?: string, itemType?: string, referenceId?: string, price?: number, couponcode?: string, couponamt?: number, createdOn?: Date, createdBy?: string, recurringPaymentAgreed?: boolean ) {
    this.itemReferenceId = itemReferenceId;
    this.itemType = itemType;
    this.referenceId = referenceId;
    this.price = price;
    this.recurringPaymentAgreed = recurringPaymentAgreed;
    this.couponcode = couponcode;
    this.couponamt = couponamt;
    this.createdOn = createdOn,

      this.createdBy = createdBy
  }

  public itemReferenceId: string;
  public itemType: string;
  public referenceId: string;
  public couponcode: string;
  public couponamt: number;
  public recurringPaymentAgreed: boolean;
  public price: number;
  public createdOn: Date;
  public createdBy: string;

  toPlainObj(): { itemReferenceId?: string, itemType?: string, referenceId?: string, price?: number, couponcode?: string, couponamt?: number, createdOn?: Date, createdBy?: string, recurringPaymentAgreed?:boolean } {
    return Object.assign({}, this);
  }

}
