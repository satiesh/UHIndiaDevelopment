export class newuser {
  constructor(uid?: string, email?: string, photoURL?: string, emailVerified?: boolean, displayName?: string, memberId?: string, disabled?: boolean,createdBy?:string, createdOn?:Date) {

    this.uid = uid;
    this.email = email;
    this.photoURL = photoURL;
    this.emailVerified = emailVerified;
    this.memberId = memberId;
    this.disabled =  disabled; 
    this.displayName = displayName;
    this.createdBy= createdBy;
    this.createdOn= createdOn;

  }
  public uid: string;
  public email: string;
  public photoURL: string;
  public emailVerified: boolean;
  public memberId: string;
  public disabled: boolean;
  public displayName: string;
  public createdBy: string;
  public createdOn: Date;

  toPlainObj(): { uid?: string, email?: string, photoURL?: string, emailVerified?: boolean, displayName?: string, memberId?: string, disabled?: boolean,createdBy?: string, createdOn?: Date} {
    return Object.assign({}, this);
  }
}
