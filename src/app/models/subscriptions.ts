// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class subscriptions {
  constructor(subscriptionId?: string, isActive?: boolean, renewalOn?: Date, createdOn?: Date, createdBy?: string) {
    this.subscriptionId = subscriptionId;
    this.isActive = isActive,
      this.renewalOn = renewalOn,
      this.createdOn = createdOn,
      this.createdBy = createdBy
  }

  public subscriptionId: string;
  public isActive: boolean;
  public renewalOn: Date;
  public createdOn: Date;
  public createdBy: string;


  toPlainObj(): { subscriptionId?: string, isActive?: boolean, renewalOn?: Date, createdOn?: Date, createdBy?: string } {
    return Object.assign({}, this);
  }
}
