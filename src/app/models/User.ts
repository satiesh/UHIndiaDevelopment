import { userprofile } from './userprofile';
import { userroles } from './userroles';
import { userothervalues } from './userothervalues';
import { userdisclaimer } from './userdisclaimer';
import { userpayment } from './userpayment';
import { usersubscription } from './usersubscription';
import { usermessaging } from './usermessaging';
import { userquestions } from './userquestions';

export class User {
  constructor(uid?: string, email?: string, photoURL?: string, emailVerified?: boolean, isNewUser?: boolean, roles?: string[], memberId?: string, disabled?:boolean) {

    this.uid = uid;
    this.email = email;
    this.photoURL = photoURL;
    this.emailVerified = emailVerified;
    this.memberId = memberId,
      this.disabled = disabled,
    this.isNewUser = isNewUser;
    this.roles = roles;
  }
  public uid: string;
  public email: string;
  public photoURL: string;
  public emailVerified: boolean;
  public displayName: string;
  public isNewUser: boolean;
  public roles: string[];
  public memberId: string;
  public disabled: boolean;
  public userprofile: userprofile;
  public userroles: userroles;
  public userothervalues: userothervalues;
  public userdisclaimer: userdisclaimer;
  public userpayment: userpayment[];
  public usersubscription: usersubscription;
  public usermessaging: usermessaging;
  public userquestions: userquestions[];

  toPlainObj(): { uid?: string, email?: string, photoURL?: string, emailVerified?: boolean, memberId?: string, disabled?: boolean} {
    return Object.assign({}, this);
  }
}
