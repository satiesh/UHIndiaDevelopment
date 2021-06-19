
export class Purchase {
  constructor(subscriptionname?: string, subscriptionamount?: string) {
    this.subscriptionname = subscriptionname;
    this.subscriptionamount = subscriptionamount;
  }
  subscriptionname: string;
  subscriptionamount: string;
}
