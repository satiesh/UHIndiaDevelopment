// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

export class userprofile {
  // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
  constructor(mobileNumber?: string, firstName?: string, lastName?: string,
    address?: string, address1?: string, city?: string, state?: string, postalZip?: string,
    country?: string, createdOn?: Date, createdBy?: string) {
    this.mobileNumber = mobileNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.address1 = address1;
    this.city = city;
    this.state = state;
    this.postalZip = postalZip,
      this.country = country,
      this.createdOn = createdOn,
      this.createdBy = createdBy
  }
  public firstName: string;
  public lastName: string;
  public address: string;
  public address1: string;
  public city: string;
  public state: string;
  public postalZip: string;
  public country: string;
  public mobileNumber: string;
  public docId: string;
  public createdOn: Date;
  public createdBy: string;

  toPlainObj(): {
    mobileNumber?: string, firstName?: string, lastName?: string,
    address?: string, address1?: string, city?: string, state?: string, postalZip?: string,
    country?: string, createdOn?: Date, createdBy?: string
  } {
    return Object.assign({}, this);
  }
}
