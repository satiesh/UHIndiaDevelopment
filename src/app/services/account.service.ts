// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, from } from 'rxjs';
import { catchError, map, mergeMap, tap, merge } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { userprofile } from '@app/models/userprofile';
import { usersubscription } from '@app/models/usersubscription';
import { userpayment } from '@app/models/userpayment';
import { userdisclaimer } from '@app/models/userdisclaimer';
import { userroles } from '@app/models/userroles';
import { userquestions } from '@app/models/userquestions';
import { environment as env } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SixDigitData } from '@app/models/sixdigitdata';
import { Courses } from '@app/models/courses';
import { PermissionValues, Roles, usermessaging } from '@app/models';
//import { User } from 'firebase';
import * as firebase from 'firebase';
import { User } from '@app/models/user';
import { newuser } from '../models/newuser';
import { subscriptions } from '../models/subscriptions';
import { useroptiontrades } from '../models/useroptiontrade';
import { userothervalues } from '../models/userothervalues';
const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
const serviceUrl = env.backendApiUrl

@Injectable()
export class AccountService {

  currentuser: AngularFirestoreCollection<User[]>;
  useroptionstrade: AngularFirestoreCollection<useroptiontrades[]>;
  userProfileList: AngularFirestoreCollection<User>;
  courseList: AngularFirestoreCollection<Courses>;
  userList: AngularFirestoreCollection<User[]>;
  memberUser: AngularFirestoreCollection<User>;

  constructor(private authService: AuthService,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private http: HttpClient) { }

  getuser(uid?: string): Observable<any> {
    this.userProfileList = this.afs.collection<any>('/userprofile', ref => { return ref.where('uid', "==", uid) });
    return this.userProfileList.valueChanges({ idField: 'docId' });
  }

  getuserbymemberid(memberid?: string): Observable<User[]> {
    this.memberUser = this.afs.collection('/users', ref => { return ref.where('memberid', "==", memberid) });
    return this.memberUser.valueChanges();
  }


  getcurrentuser(uid?: string): Observable<any> {
    this.currentuser = this.afs.collection<any>('/users', ref => { return ref.where('uid', "==", uid) });
    return this.currentuser.valueChanges({ idField: 'id' });
  }

  getuserAndRoles(uid?: string) { }


  getusers(): Observable<any> {
    this.userList = this.afs.collection<any>('/users');
    return this.userList.valueChanges({ idField: 'id' })
  }

  getuseroptions(uid?: string): Observable<any> {
    if (uid) {
      this.useroptionstrade = this.afs.collection<any>('/useroptiontrades', ref => { return ref.where('uid', "==", uid) });
      return this.useroptionstrade.valueChanges({ idField: 'id' });
    }
  }
  updateuseroptions(ouseroptiontrades: useroptiontrades): Observable<any> {
    console.log(ouseroptiontrades);
    const res = this.afs.collection('/useroptiontrades')
      .doc(ouseroptiontrades.id)
    var ObservableFrom = from(res.delete());
    return ObservableFrom;
  }

  adduseroptions(ouseroptiontrades: useroptiontrades): Observable<any> {
    const res = this.afs.collection('/useroptiontrades').doc(ouseroptiontrades.id)
    var ObservableFrom = from(res.set(ouseroptiontrades.toPlainObj()));
    return ObservableFrom;
  }

  disableUser(user: User): Observable<any> {
    //const res = this.afs.collection<any>('/users')
    //  .doc(user.uid)
    //var ObservableFrom = from(res.delete());

    var nUser: newuser = new newuser(user.uid, user.email, user.photoURL, user.emailVerified, user.displayName, user.memberId, user.disabled, user.userprofile.createdBy, user.userprofile.createdOn)
    var res = this.afs.collection('/users').doc(user.uid);
    var ObservableFrom = from(res.set(nUser.toPlainObj(), { merge: true }))

    const disableUser = firebase
      .functions()
      .httpsCallable('disableUser');

    disableUser({ uid: user.uid, value: user.disabled })
      .then(function (result) {
        if (result.data.disabled) {
        }
      })
      .catch(function (error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var details = error.details;
        // ...
      });
    return ObservableFrom;
  }

  deleteusers(user: User): Observable<any> {

    const res = this.afs.collection<any>('/users')
      .doc(user.uid)
    var ObservableFrom = from(res.delete());

    const deletUser = firebase
      .functions()
      .httpsCallable('deleteUser');

    deletUser({ uid: user.uid })
      .then(function (result) {
        if (result.data.deleted) {
        }
      })
      .catch(function (error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var details = error.details;
        // ...
      });
    return ObservableFrom;
  }

  getSubCollections(path): Observable<any> {
    // console.log(path);
    var getAllCooectionFn = firebase.functions().httpsCallable('getSubCollections');
    getAllCooectionFn({ docPath: path })
    var ObservableFrom = from(getAllCooectionFn({ docPath: path }));
    return ObservableFrom;

    //.then(function (result) {
    //  var collections = result.data.collections;
    //  console.log(collections);
    //})
    //.catch(function (error) {
    //  // Getting the Error details.
    //  var code = error.code;
    //  var message = error.message;
    //  var details = error.details;
    //  // ...
    //});
  }

  deleteAtPath(path) {
    var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
    deleteFn({ path: path })
      .then(function (result) {
        //logMessage('Delete success: ' + JSON.stringify(result));
      })
      .catch(function (err) {
        //logMessage('Delete failed, see console,');
        console.warn(err);
      });
  }

  async updateUserMessaging(uid: string, usermessagingtoken: usermessaging) {
    var res = await this.afs.collection('/users').doc(uid);
    res.set({ 'usermessaging': usermessagingtoken.toPlainObj() }, { merge: true }).then(function () {

    })
      .catch(function (error) {
        console.log(error);
      })
  }

  async updateUserRole(uid: string, oUserRoles: userroles) {
    var res = await this.afs.collection('/users').doc(uid);
    res.set({ 'userroles': oUserRoles.toPlainObj() }, { merge: true }).then(function () {

    })
      .catch(function (error) {
        console.log(error);
      })
  }

  async updateUserSubscription(uid: string, oUsersubscription: usersubscription, oUserPayments: userpayment[]) {
    var userSubscriptions: usersubscription = new usersubscription();
    userSubscriptions.subscriptions = oUsersubscription.subscriptions;
    const subscriptions = userSubscriptions.subscriptions.map((obj) => { return Object.assign({}, obj) });
    const payments = oUserPayments.map((obj) => { return Object.assign({}, obj) });

    var res = await this.afs.collection('/users').doc(uid);
    res.set({ 'usersubscription': { 'subscriptions': subscriptions } }, { merge: true })
      .then(function () {
        res.set({ 'userpayment': payments }, { merge: true });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async updateUserDiscalimer(userId: string, oUserProfile: userdisclaimer, oUserquestions: userquestions[]) {
    console.log(userId);
    console.log(oUserProfile);
    console.log(oUserquestions);
    const questions = oUserquestions.map((obj) => { return Object.assign({}, obj) });
    var res = await this.afs.collection('/users').doc(userId);
    res.set({ 'userdisclaimer': oUserProfile.toPlainObj() }, { merge: true })
      .then(function () {
        res.set({ 'userquestions': questions }, { merge: true });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async updateUserProfile(user: User, oUserProfile: userprofile) {
    var nUser: newuser = new newuser(user.uid, user.email, user.photoURL, user.emailVerified, user.displayName, user.memberId, user.disabled, user.userprofile.createdBy, user.userprofile.createdOn)
    var res = await this.afs.collection('/users').doc(user.uid);
    res.set(nUser.toPlainObj(), { merge: true }).then(function () {
      res.set({ 'userprofile': user.userprofile.toPlainObj() }, { merge: true })
    })
      .catch(function (error) {
        console.log(error);
      })
  }

  async updateUserOtherValues(uid: string, oUserothervalues: userothervalues) {
    // console.log(uid);
    // console.log(oUserothervalues);
    var res = await this.afs.collection('/users').doc(uid);
    res.set({ 'userothervalues': oUserothervalues.toPlainObj() }, { merge: true })
      .then(function () {
        console.log("done saving");
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async updateUserFormList(user: User, userProfile: userprofile, userRoles: userroles, userothervalues: userothervalues) {

    var nUser: newuser = new newuser(user.uid, user.email, user.photoURL, user.emailVerified, user.displayName, user.memberId, user.disabled, userProfile.createdBy, userProfile.createdOn)
    //console.log(JSON.stringify(nUser));
    //console.log(JSON.stringify(userProfile));
    //console.log(JSON.stringify(userRoles));
    //console.log(JSON.stringify(userothervalues));
    var res = await this.afs.collection('/users').doc(nUser.uid);
    res.set(nUser.toPlainObj(), { merge: true }).then(function () {
      res.set({ 'userroles': userRoles.toPlainObj() }, { merge: true });
      res.set({ 'userothervalues': userothervalues.toPlainObj() }, { merge: true });
      res.set({ 'userprofile': userProfile.toPlainObj() }, { merge: true });
    })
      .catch(function (error) {
        console.log(error);
      })
  }


  async updateUser(user: newuser, userProfile: userprofile, userRoles: userroles, userdisclaimer: userdisclaimer,
    userSubscription: subscriptions[], userpayments: userpayment[], userquestions: userquestions[]) {

    //console.log(JSON.stringify(user));
    //console.log(JSON.stringify(userProfile));
    //console.log(JSON.stringify(userRoles));
    //console.log(JSON.stringify(userdisclaimer));
    //console.log(JSON.stringify(userSubscription));
    //console.log(JSON.stringify(userpayments));
    //console.log(JSON.stringify(userquestions));




    const payments = userpayments.map((obj) => { return Object.assign({}, obj) });
    const questions = userquestions.map((obj) => { return Object.assign({}, obj) });
    var userSubscriptions: usersubscription = new usersubscription();
    userSubscriptions.subscriptions = userSubscription;
    const subscriptions = userSubscriptions.subscriptions.map((obj) => { return Object.assign({}, obj) });


    var res = await this.afs.collection('/users').doc(user.uid);
    res.set(user.toPlainObj(), { merge: true }).then(function () {
      res.set({
        'userroles': userRoles.toPlainObj()
      }, { merge: true });
      res.set({ 'userdisclaimer': userdisclaimer.toPlainObj() }, { merge: true });
      res.set({ 'userprofile': userProfile.toPlainObj() }, { merge: true });
      res.set({ 'usersubscription': { 'subscriptions': subscriptions } }, { merge: true });
      res.set({ 'userquestions': questions }, { merge: true });
      res.set({ 'userpayment': payments }, { merge: true });
    })
      .catch(function (error) {
        console.log(error);
      })
  }

  async newUserProfile(user: newuser, userProfile: userprofile, userRoles: userroles, userdisclaimer: userdisclaimer,
    userSubscription: subscriptions[], userpayments: userpayment[], userquestions: userquestions[]) {

    //console.log(JSON.stringify(user));
    //console.log(JSON.stringify(userProfile));
    //console.log(JSON.stringify(userRoles));
    //console.log(JSON.stringify(userdisclaimer));
    //console.log(JSON.stringify(userSubscription));
    //console.log(JSON.stringify(userpayments));
    //console.log(JSON.stringify(userquestions));
    const payments = userpayments.map((obj) => { return Object.assign({}, obj) });
    const questions = userquestions.map((obj) => { return Object.assign({}, obj) });
    var userSubscriptions: usersubscription = new usersubscription();
    userSubscriptions.subscriptions = userSubscription;
    const subscriptions = userSubscriptions.subscriptions.map((obj) => { return Object.assign({}, obj) });

    var res = await this.afs.collection('/users').doc(user.uid);
    res.set(user.toPlainObj()).then(function () {
      res.set({
        'userroles': userRoles.toPlainObj()
      }, { merge: true });
      res.set({ 'userdisclaimer': userdisclaimer.toPlainObj() }, { merge: true });
      res.set({ 'userprofile': userProfile.toPlainObj() }, { merge: true });
      res.set({ 'usersubscription': { 'subscriptions': subscriptions } }, { merge: true });
      res.set({ 'userquestions': questions }, { merge: true });
      res.set({ 'userpayment': payments }, { merge: true });
    })
      .catch(function (error) {
        console.log(error);
      })
  }




  async updateUserProfile_ORG(data: userprofile, docId: string) {
    if (docId) {
      const res = await this.afs.collection('/userprofile')
        .doc(docId)
        .set(data.toPlainObj())
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    else {
      const res = await this.afs.collection('/userprofile')
        .add(data.toPlainObj())
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  }

  async updateUserSubscription_ORG(data: usersubscription, docId: string) {
    if (docId) {
      const res = await this.afs.collection('/usersubscription')
        .doc(docId)
        .set(data)
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    else {
      const res = await this.afs.collection('/usersubscription')
        .add(data)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  }

  async updateUserPayment(data: userpayment, docId: string) {
    if (docId) {
      const res = await this.afs.collection('/userpayment')
        .doc(docId)
        .set(data.toPlainObj())
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    else {
      const res = await this.afs.collection('/userpayment')
        .add(data.toPlainObj())
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  }

  async updateUserDisclaimer(data: userdisclaimer, docId: string) {
    if (docId) {
      const res = await this.afs.collection('/userdisclaimer')
        .doc(docId)
        .set(data.toPlainObj())
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    else {
      const res = await this.afs.collection('/userdisclaimer')
        .add(data.toPlainObj())
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  }

  async updateUserRole_Org(data: userroles, docId: string) {
    if (docId) {
      const res = await this.afs.collection('/userroles')
        .doc(docId)
        .set(data.toPlainObj())
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    else {
      const res = await this.afs.collection('/userroles')
        .add(data.toPlainObj())
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  }

  public sendVerificationCode = (sixdigitdata: SixDigitData): Observable<any> => {
    const url = `${serviceUrl}sendverification`;
    return this.http
      .post(url, JSON.stringify(sixdigitdata), httpOptions)
      .pipe(map((r: any) => r));
  }

  public verifyVerificationCode = (sixdigitdata: SixDigitData): Observable<any> => {
    const url = `${serviceUrl}verifycode`;
    return this.http
      .post(url, JSON.stringify(sixdigitdata), httpOptions)
      .pipe(map((r: any) => r));
  }

  userHasPermission(permissionValue: PermissionValues): boolean {
    return this.permissions.some(p => p === permissionValue);
  }

  get permissions(): PermissionValues[] {
    return this.authService.userPermissions;
  }
}

