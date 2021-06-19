
export class CustomClaims {
  constructor(idToken?: string, email?: string, roleName?: any) {

    this.idToken = idToken;
    this.email = email;
    this.roleName = roleName;
  }
  public idToken: string;
  public email: string;
  public roleName: any;

  toPlainObj(): { idToken?: string, email?: string, roleName?: any } {
    return Object.assign({}, this);
  }
}
