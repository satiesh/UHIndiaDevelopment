// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Injectable, NgZone } from '@angular/core';

import { auth, firestore } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router, NavigationExtras } from "@angular/router";
import { Subject, Observable, merge } from 'rxjs';
import { Utilities } from '@app/services/utilities';
import { HttpResponseBase, HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';


import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { LocalStoreManager } from './local-store-manager.service';
import { environment as env } from '@environments/environment';
//model
import { User } from "../models/user";
import { UserLogin } from '../models/user-login.model';
import { promise, error } from 'protractor';
import { AlertService, MessageSeverity } from './alert.service';
import { map, filter } from 'rxjs/operators';
import { userprofile, CustomClaims, PermissionValues, userroles, subscriptions } from '@app/models';
import { DatePipe } from '@angular/common';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '@app/store';
import { Store, select } from '@ngrx/store';
import { CurrentUsersRequestAction } from '../store/currentuser-data/current-contextuser-data.action';
import { EncrDecrService } from './encrdecr.service';
import { deleteUser } from '@app/store/currentuser-data/current-contextuser-data.selectors';
const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
const serviceUrl = env.backendApiUrl

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public UserRole: any;
  courseId: string;
  public get loginUrl() { return this.configurations.loginUrl; }
  public get homeUrl() { return this.configurations.homeUrl; }
  clearCurrentUser$: Observable<User>;
  selectedUser: User = new User();
  public loginRedirectUrl: string;
  public logoutRedirectUrl: string;
  subscribedUser: boolean;
  groupBelongsTo: string = '';
  public reLoginDelegate: () => void;
  //userRoleList: AngularFirestoreCollection<any>;

  private previousIsLoggedInCheck = false;
  private loginStatus = new Subject<boolean>();

  fbUserData: firebase.User;
  userData: User; // Save logged in user data
  redirectUrl: string;
  constructor(
    public router: Router,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private alertService: AlertService,
    private encrdecrService: EncrDecrService,
    private configurations: ConfigurationService,
    private store$: Store<RootStoreState.State>,
    private localStorage: LocalStoreManager, private http: HttpClient, private datePipe: DatePipe) {
    this.initializeLoginStatus();
 

    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */

    this.afAuth.authState.subscribe(user => {
      if (user) {
        //    this.fbUserData = user;
      }
    })
   
  }

  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }



  private reevaluateLoginStatus(currentUser?: User) {
    const user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    const isLoggedIn = user != null;
    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {
        this.loginStatus.next(isLoggedIn);
      });
    }
    this.previousIsLoggedInCheck = isLoggedIn;
  }


  getLoginStatusEvent(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }
  get currentUser(): User {

    const user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    this.reevaluateLoginStatus(user);
    return user;
  }

  get groupInfo(): string {
    var groupNmae = this.localStorage.getDataObject<string>(DBkeys.GROUP_BELONGS);
    var returnValue: string = '';
    if (groupNmae) {
      returnValue = this.encrdecrService.decrypt(groupNmae).toString(CryptoJS.enc.Utf8);
    }
    return returnValue;
  }


  // isSessionExpired
  get isSessionExpired(): boolean {
    return true;
    //return this.oidcHelperService.isSessionExpired;
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }
  get checksubscription(): boolean {
    let isSubscriptionGood: boolean = false;
    const userProfile = this.afs.doc('/users/' + this.currentUser.uid).valueChanges();
    userProfile.subscribe(doc => {
      if (doc) {
        if (doc["usersubscription"]) {
          if (doc["usersubscription"].subscriptions && doc["usersubscription"].subscriptions.length > 0) {
            isSubscriptionGood = true;
          }
          else {
            isSubscriptionGood = false;
          }
        }
        else {
          isSubscriptionGood = false;
        }
      }
    });
    return isSubscriptionGood;
  }
  // rememberMe
  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) === true;
  }

  // Sign in with email/password
  SignIn(user: UserLogin) {
    return this.afAuth.signInWithEmailAndPassword(user.userName, user.password)
      .then((result) => {
        if (!result.user.emailVerified) {
          this.ngZone.run(() => {
            this.router.navigate(['/verifyemail']);
          });
        }
        else {
          this.afAuth.authState.pipe(filter(user => user !== null)).subscribe(data => {
            this.UpdateUserDataNew(data, user.rememberMe);
          });
        }
      }).catch((error) => {
        this.alertService.showStickyMessage('Unable to login', error.message, MessageSeverity.error, error);
      })
  }

  async UpdateUserDataNew(data: firebase.User, rememberMe: boolean) {
    this.subscribedUser = false;
    var strRoles: string[] = [];
    var docRef: AngularFirestoreDocument = this.afs.collection("users").doc(data.uid)

    docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot.exists) {
        var docData = docSnapshot.data();
        this.UserRole =  docData["userroles"].roleName;
        if (docData["usersubscription"].subscriptions && docData["usersubscription"].subscriptions.length > 0) {
          let currectsubscriptions: subscriptions;
          currectsubscriptions = docData["usersubscription"].subscriptions.find(a => a.isActive == true);
          var subDocRef: AngularFirestoreDocument = this.afs.collection("subscription").doc(currectsubscriptions.subscriptionId);

          subDocRef.get().toPromise().then((docSubSnapshot) => {
            if (docSubSnapshot.exists) {
              var docSubData = docSubSnapshot.data();
              this.groupBelongsTo = docSubData.GroupName;
              //console.log(this.groupBelongsTo);

              if (docData["userroles"] && docData["userroles"].roleName) {
                strRoles = docData["userroles"].roleName.split(",");
              }
              else {
                strRoles = "Subscriber".split(",");
              }
              this.userData = new User(data.uid, data.email, data.photoURL, data.emailVerified, false, strRoles);
              this.setuserpermission(data, rememberMe, this.groupBelongsTo);
            }
          });

          // console.log(currectsubscriptions);
          this.subscribedUser = true;
        }
      }
      else {
        strRoles = "Subscriber".split(",");
        this.userData = new User(data.uid, data.email, data.photoURL, data.emailVerified, false, strRoles);
        this.setuserpermission(data, rememberMe, this.groupBelongsTo);
      }
    });
  }

  async setupUserDataFromLoggedInUser(hasRole: boolean, docUserdata: firestore.DocumentData, data: firebase.User, rememberMe: boolean) {
    this.userData = new User(data.uid, data.email, data.photoURL, data.emailVerified, false, null);
    var strRoles: string[] = [];
    var strPermission: string[] = [];
    if (hasRole) {
      var strArray = docUserdata["userroles"].roleName.split(',');
      for (var i = 0; i < strArray.length; i++) { strRoles.push(strArray[i]); }
      this.userData.roles = strRoles;
      for (let role of strRoles) {
        const roleList = this.afs.collection<any>('/roles', ref => { return ref.where('RoleName', "==", role) }).valueChanges();
        roleList.subscribe(roleDoc => {
          if (roleDoc) {
            roleDoc.forEach(permmissionDoc => {
              if (permmissionDoc.Permission) {
                let permission = permmissionDoc.Permission.toString().split(",");
                for (let entry of permission) {
                  if (strPermission.indexOf(entry.toLowerCase()) > -1) {
                    //In the array!
                  } else {
                    strPermission.push(entry.toLowerCase());
                  }
                }
              }
            });
          }
        });
      }
      this.saveUserDetails(this.userData, strPermission, null, null, null, rememberMe, null, this.groupBelongsTo);

      //var result = this.getPermissionsForGivenRoles(strArray);


      //console.log(result);
      // for (var i = 0; i < result.length; i++) {
      //   strPermission.push(result[i]);
      //   console.log(result[i]);
      // }
      //this.getPermissionsForGivenRoles(strArray).then((result) => {
      //strPermission.push(result.join());
      //console.log(result);
      //})
    }
  }

  getPermissionsForGivenRoles(role: string) {
    var strPermissions: string;
    var arrayPermission: string[] = [];
    //for (let role of roleArray) {
    const roleList = this.afs.collection<any>('/roles', ref => { return ref.where('RoleName', "==", role) });//.valueChanges();
    roleList.valueChanges()
      .subscribe(roleDoc => {
        if (roleDoc) {
          roleDoc.forEach(permmissionDoc => {
            if (permmissionDoc.Permission) {
              let permission = permmissionDoc.Permission.toString().split(",");
              for (let entry of permission) {
                if (arrayPermission.indexOf(entry.toLowerCase()) > -1) {
                  //In the array!
                } else {
                  arrayPermission.push(entry.toLowerCase());
                  strPermissions = strPermissions ? strPermissions + "," + entry.toLowerCase() : entry.toLowerCase();
                  //console.log(strPermissions);
                }
              }
            }
          });
        }
      });
    //console.log(strPermissions);
    //}
    return strPermissions;
  }

  async UpdateUserData(data: firebase.User, rememberMe: boolean) {
    //    console.log("UpdateUserData");


    let docRef: AngularFirestoreDocument = this.afs.collection("users").doc(data.uid) //doc('/users/' + data.uid)
    docRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot.exists) {
        this.subscribedUser = true;
        this.setUserDataByDoc(docRef, data, rememberMe),
          this.setuserpermission(data, rememberMe)
      }
      else {
        this.subscribedUser = false;
        this.setUserDataByDoc(docRef, data, rememberMe),
          this.setuserpermission(data, rememberMe)
        //    console.log("not found");
      }
    }).catch((error) => {
      this.alertService.showStickyMessage('Unable to login', error.message, MessageSeverity.error, error);
    })

    //if (this.subscribedUser) {
    //  docRef.get().subscribe(doc => {
    //  })
    //}
    //else {
    //  this.setUserDataByDoc(docRef, data, rememberMe),
    //    this.setuserpermission(docRef, data, rememberMe)
    //  //this.profileredirect();
    //}
    //docRef.get().subscribe(doc => {
    //  docRef[doc.exists ? 'update' : 'set']({
    //    exampleFlag: true
    //  })
    //})


    //const userProfileinfo = this.afs.doc('/users/' + data.uid).valueChanges();
    //userProfileinfo.subscribe(doc => {
    //  if (doc) {
    //    console.log("doc" + doc);
    //    let userData: User = new User();
    //    userData.displayName = doc["displayName"];
    //    this.setUserDataByDoc(doc, data, rememberMe),
    //      this.setuserpermission(doc, data, rememberMe)
    //  }
    //  else {
    //    console.log("no doc" + doc);
    //    this.router.navigate(['/setprofile']);
    //  }
    //},
    //  err => {
    //    console.log("err doc" + err);

    //    this.router.navigate(['/setprofile']);
    //  }

    //);


    // Get the roles for the user.
    //const userRoleList = this.afs.collection<any>('/userroles', ref => { return ref.where('uid', "==", data.uid) }).valueChanges();
    //userRoleList.subscribe(doc => {
    //  if (doc) {
    //    this.setuserdata(doc, data, rememberMe)
    //      , this.setuserpermission(rememberMe)

    //  }
    //});
  }

  profileredirect() {
    this.router.navigate(['/setprofile']);
  }

  async setUserDataByDoc(doc: any, data: firebase.User, rememberMe: boolean) {



    var strRoles: string[] = [];
    if (doc["userroles"]) {
      var strArray = doc["userroles"].roleName.split(',');
      for (var i = 0; i < strArray.length; i++) {
        strRoles.push(strArray[i]);
      }
      this.userData = new User(
        data.uid,
        data.email,
        data.photoURL,
        data.emailVerified,
        true, strRoles);
    }
    else {
      var date = new Date();
      let ouserroles: userroles = new userroles("Subscriber", new Date(this.datePipe.transform(date, "MM/dd/yyyy")), "SYSTEM");
      if (!this.subscribedUser) {
        let oUser = new User(data.uid, data.email, null, data.emailVerified, false, null);
        const docRef = await this.afs.collection('/users')
          .doc(data.uid)
          .set(oUser.toPlainObj())
          .then(function (result) {
            const docRef = this.afs.collection('users').doc(data.uid)
              .set({
                'userroles': ouserroles.toPlainObj()
              }
              )
          })
          .catch(function (error) {

          });
      }
      else {
        const docRef = await this.afs.collection('users').doc(data.uid)
          .set({
            'userroles': ouserroles.toPlainObj()
          }
          )
          .then(function (docRef) {
            strRoles.push("Subscriber");
            this.userData = new User(
              data.uid,
              data.email,
              data.photoURL,
              data.emailVerified,
              true, strRoles);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      }
    }
  }

  async setuserdata(doc: any[], data: firebase.User, rememberMe: boolean) {
    var strRoles: string[] = [];
    var strPermission: string = '';
    doc.forEach(role => {
      if (strRoles.indexOf(role.rolename) > -1) {
        //In the array!
      } else {
        strRoles.push(role.rolename);
      }

    });
    this.userData = new User(
      data.uid,
      data.email,
      data.photoURL,
      data.emailVerified,
      true, strRoles);
  }

  setuserpermission(data: firebase.User, rememberMe: boolean, groupBelongsTo?: string) {
    var strPermission: string[] = [];
    for (let role of this.userData.roles.toString().split(",")) {
      const roleList = this.afs.collection<any>('/roles', ref => { return ref.where('RoleName', "==", role) }).valueChanges();
      roleList.subscribe(roleDoc => {
        if (roleDoc) {
          roleDoc.forEach(permmissionDoc => {
            if (permmissionDoc.Permission) {
              let permission = permmissionDoc.Permission.toString().split(",");
              for (let entry of permission) {
                if (strPermission.indexOf(entry.toLowerCase()) > -1) {
                  //In the array!
                } else {
                  //strPermission.push(this.encrdecrService.encrypt(entry.toLowerCase()));
                  strPermission.push(entry.toLowerCase());
                }
              }
              this.saveUserDetails(this.userData, strPermission, null, data.refreshToken, null, rememberMe, null, this.groupBelongsTo);
            }
          });
          this.AuthRedirect(null);
        }
      });
    }
  }

  transformSecondsToDate(secondsValu: any): Date {
    if (secondsValu) {
      const unixTime = secondsValu;
      const date = new Date(unixTime["seconds"] * 1000);
      return date;
    }
  }

  //async GetRoles(uid: string): string {
  //  const userRoleList = this.afs.collection<any>('/userroles', ref => { return ref.where('uid', "==", uid) }).valueChanges();
  //  const rolearray: string[] = []
  //  var str1: string = '';
  //  userRoleList.forEach(doc => {
  //    doc.forEach(role => {
  //      console.log(role.rolename.toLowerCase());
  //      rolearray.push(role.rolename.toLowerCase());
  //      str1.concat(role.rolename.toLowerCase() + ",");
  //    })
  //  });
  //  return str1
  //}

  saveUserDetails(user: User, permissions: string[], accessToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean, userProfile?: userprofile, groupBelongsTo?: string) {
    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
      this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.savePermanentData(this.encrdecrService.encrypt(groupBelongsTo), DBkeys.GROUP_BELONGS);
    } else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
      this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.saveSyncedSessionData(this.encrdecrService.encrypt(groupBelongsTo), DBkeys.GROUP_BELONGS);
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }
  
  getRedirectUrl() {
    const redirect = this.router.url;
    const red = redirect.split('?')[1];
    const url = decodeURIComponent((red + '').replace(/\+/g, '%20'));
    const withidUrl = url.slice(0, url.length - 1);
    this.courseId = withidUrl.substring(withidUrl.lastIndexOf('/') + 1, withidUrl.length);
    this.redirectUrl = withidUrl.substring(0, withidUrl.lastIndexOf('/') + 1);
    if (this.redirectUrl === 'auth/course-purchase/' ) {
      this.router.navigate(['/auth/course-purchase' , { 'data' : this.courseId}]);
    } else if (this.UserRole === 'Subscriber' && this.redirectUrl !== 'auth/course-purchase')  {
      this.router.navigate(['/auth/reports']);
    }
    else {
      this.router.navigate(['/auth/dashboard']);
    }
  }

  AuthRedirect(doc: any) {
    if (this.subscribedUser) {
      this.ngZone.run(() => {
      this.getRedirectUrl();
      });
    }
    else {
      this.ngZone.run(() => {
        this.router.navigate(['/setprofile']);
      });
    }
    //if (doc["usersubscription"]) {
    //  if (doc["usersubscription"].subscriptions && doc["usersubscription"].subscriptions.length > 0) {
    //    this.ngZone.run(() => {
    //      this.router.navigate(['/auth/dashboard']);
    //    });
    //  }
    //  else {
    //    this.ngZone.run(() => {
    //      this.router.navigate(['/setprofile']);
    //    });
    //  }
    //}
    //else {
    //  this.ngZone.run(() => {
    //    this.router.navigate(['/setprofile']);
    //  });
    //}

    //this.ngZone.run(() => {
    //  this.router.navigate(['/redirect']);
    //});
  }


  // Sign up with email/password
  SignUp(user: UserLogin) {
    return this.afAuth.createUserWithEmailAndPassword(user.userName, user.password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        //this.f();
        this.SetUserData(result.user, false);
      }).catch((error) => {
        this.alertService.showStickyMessage('Unable to register please check with customer support', error.message, MessageSeverity.error, error);
      })
  }

  /* Setting up user data when sign in with username/password, 
 sign up with username/password and sign in with social auth  
 provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  setCustomClaims() {
    this.afAuth.authState.pipe(filter(user => user !== null)).subscribe(user => {
      user.getIdTokenResult().then((idTokenResult) => {
      })

      var obj = { 'subscriber': true };

      let customCliams = new CustomClaims();
      const url = `${serviceUrl}setCustomClaims`;
      const idToken = user.getIdToken(true).then(function (idToken) {
        customCliams = new CustomClaims(idToken, user.email, obj)
        return this.http
          .post(url, JSON.stringify(customCliams), httpOptions)
          .pipe(map((r: any) => r));
      }).catch(function (error) {
      });
    });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    if (this.afAuth.currentUser) {
      return this.afAuth.currentUser.then(u => u.sendEmailVerification())
        .then(() => {
          this.router.navigate(['verifyemail']);
        })
    }
    else {

    }
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail): string {
    var result = '';
    this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        //result = 'true';
        //window.alert('Password reset email sent, check your inbox.');
        this.alertService.showMessage("SUCCESS", 'Password reset email sent, please check your inbox.', MessageSeverity.success);
      }).catch((error) => {
        this.alertService.showStickyMessage(error);
        //result = error;
        //window.alert(error)
      })
    return result;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  TwitterAuth() {
    return this.AuthLogin(new auth.TwitterAuthProvider());
  }

  MicrosoftAuth() {
    return this.AuthLogin(new auth.OAuthProvider('microsoft.com'));
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        //this.SetUserData(result.user, false);
        this.UpdateUserDataNew(result.user, false);
        //this.ngZone.run(() => {
        //  this.router.navigate(['auth']);
        //})
        //this.setCustomClaims();
      }).catch((error) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  GetUserData(user, rememberMe: boolean): Observable<User> {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    return userRef.snapshotChanges()
      .pipe(
        map(changes => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        })
      )

  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user, rememberMe: boolean): Observable<User> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    return userRef.snapshotChanges()
      .pipe(
        map(changes => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        })
      )
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
      this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
      this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
      this.localStorage.deleteData(DBkeys.CURRENT_USER);
      this.localStorage.deleteData(DBkeys.GROUP_BELONGS);
      this.configurations.clearLocalChanges();
      this.reevaluateLoginStatus();
    })
  }

  redirectLogoutUser() {
    const redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
    this.logoutRedirectUrl = null;

    this.router.navigate([redirect]);
  }




  // redirectLoginUser
  redirectLoginUser() {
    const redirect = this.loginRedirectUrl && this.loginRedirectUrl !== '/' && this.loginRedirectUrl !== ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
    this.loginRedirectUrl = null;

    const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    const urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

    const navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: 'merge'
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }

  ////get userPermissionsArray(): string[] {

  ////}

  get userPermissions(): PermissionValues[] {
    //let storedPermissionValues: PermissionValues[] = this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
    //console.log(storedPermissionValues);
    //let newPermissionValues: PermissionValues[];
    //if (storedPermissionValues.length > 0) {
    //  for (var i = 0; i < storedPermissionValues.length; i++) {
    //    let oPermissionValues: PermissionValues = new PermissionValues()
    //    newPermissionValues.push(this.encrdecrService.decrypt(storedPermissionValues[i].toString(CryptoJS.enc.Utf8)));
    //  }
    //}
    var permissionData:string[] = Utilities.JsonTryParse(this.localStorage.getDataObject<string>(DBkeys.USER_PERMISSIONS));
    //console.log(permissionData);
    //permissionData.forEach(item => {
    //  console.log(item);
    //});
    //console.log(permissionData);
    //if (permissionData.length > 0) {
    //  //return permissionData as PermissionValues[];
    //}
    //else {
    //  //return [];
    //}

    return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
  }
}

