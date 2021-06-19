// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Purchase } from './Purchase';
export class paramsvalues {
  constructor(purchase?: Purchase[]) {
    this.purchase = purchase;
  }
  purchase: Purchase[];
}
