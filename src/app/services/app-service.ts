// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Subscription, Observable, from } from 'rxjs';
import { tradingtools } from '@app/models/tradingtools';
import { map, catchError, tap } from 'rxjs/operators';
import { environment as env } from '@environments/environment';
import {
  userprofile, disclaimer, Courses, Roles, ServiceSubscription,
  investmenttypes, investorlevel, dailyticker, channel, optionstrade, optionstradeedit, questions, coupons, channelDTO, template
} from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { broadcastinfo } from '@app/models/broadcastinfo';
import { optionstradenotes } from '../models/optionstradenotes';
import * as firebase from 'firebase';
import { TradeData } from '../models/azure/tradedata';
import { Router } from '@angular/router';
const serviceUrl = env.backendApiUrl;
const azureServiceUrl = env.azureApi;
const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };

@Injectable({
  providedIn: 'root'
})
export class AppService {
  userssRef: AngularFireList<any>;    // Reference to User data list, its an Observable
  userRef: AngularFireObject<any>;   // Reference to User object, its an Observable too
  disclaimerobj: AngularFirestoreCollection<any>
  courseList: AngularFirestoreCollection<Courses[]>;
  rolesList: AngularFirestoreCollection<Roles[]>;
  permissionsList: AngularFirestoreCollection<Roles[]>;
  investmenttypesList: AngularFirestoreCollection<investmenttypes[]>;
  investorlevelList: AngularFirestoreCollection<investorlevel[]>;
  subscriptionList: AngularFirestoreCollection<ServiceSubscription[]>;
  tradingtoolsList: AngularFirestoreCollection<tradingtools[]>;
  dailytradeList: AngularFirestoreCollection<dailyticker[]>;
  questionList: AngularFirestoreCollection<questions[]>;
  channelList: AngularFirestoreCollection<channel[]>;
  optionstradeList: AngularFirestoreCollection<optionstrade[]>;
  couponList: AngularFirestoreCollection<coupons[]>;
  templateList: AngularFirestoreCollection<template[]>;

  // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFirestore, public adb: AngularFireDatabase, private http: HttpClient , private router: Router) { 
  }

  getDisclaimer(): Observable<any> {
    this.disclaimerobj = this.db.collection<disclaimer>('/disclaimer', ref => { return ref.where('isActive', "==", true) });
    return this.disclaimerobj.valueChanges({ idField: 'id' });
  }

  getcourses(): Observable<any> {
    this.courseList = this.db.collection<any>('/courses', ref => { return ref.where('IsActive', "==", true) });
    return this.courseList.valueChanges({ idField: 'id' })

  }

  getsubscriptions(): Observable<any> {
    this.subscriptionList = this.db.collection<any>('/subscription');
    return this.subscriptionList.valueChanges({ idField: 'id' })
  }

  getroles(): Observable<any> {
    this.rolesList = this.db.collection<any>('/roles');
    return this.rolesList.valueChanges({ idField: 'id' })
  }

  getpermissions(): Observable<any> {
    this.permissionsList = this.db.collection<any>('/permissions');
    return this.permissionsList.valueChanges({ idField: 'id' })
  }

  getinvestmenttypes(): Observable<any> {
    this.investmenttypesList = this.db.collection<any>('/investmenttypes');
    return this.investmenttypesList.valueChanges({ idField: 'id' })
  }
  getinvestorlevel(): Observable<any> {
    this.investorlevelList = this.db.collection<any>('/investorlevel');
    return this.investorlevelList.valueChanges({ idField: 'id' })
  }

  gettradingTools(): Observable<any> {
    this.tradingtoolsList = this.db.collection<any>('/tradingtools');
    return this.tradingtoolsList.valueChanges({ idField: 'id' })
  }


  getdailyTrade(): Observable<any> {
    this.dailytradeList = this.db.collection<any>('/dailytrade');
    return this.dailytradeList.valueChanges({ idField: 'id' })
  }

  getquestions(): Observable<any> {
    this.questionList = this.db.collection<any>('/questions');
    return this.questionList.valueChanges({ idField: 'id' })
  }

  getChannel(): Observable<any> {
    this.channelList = this.db.collection<any>('/channels');
    return this.channelList.valueChanges({ idField: 'id' })
  }
  getoptionsTrade(): Observable<any> {
    this.optionstradeList = this.db.collection<any>('/optionstrade');
    return this.optionstradeList.valueChanges({ idField: 'id' })
  }
  getcoupons(): Observable<any> {
    this.couponList = this.db.collection<any>('/coupons');
    return this.couponList.valueChanges({ idField: 'id' })
  }

  getCouponByName(name: string) {
    this.couponList = this.db.collection<any>('/coupons', ref => { return ref.where('name', "==", name.trim()) });
    return this.couponList.valueChanges({ idField: 'id' })
  }

  gettemplates(): Observable<any> {
    this.templateList = this.db.collection<any>('/templates');
    return this.templateList.valueChanges({ idField: 'id' })
  }

  getNewDocId() {
    return this.db.createId();
  }

  calculateCoupon(couponcode: string) {
    this.couponList = this.db.collection<any>('/coupons', ref => { return ref.where('name', "==", couponcode.trim()) });
    return this.couponList.valueChanges({ idField: 'id' })
  }
  updateSubscription(subscription: ServiceSubscription): Observable<any> {
    const res = this.db.collection('/subscription')
      .doc(subscription.id)
    var ObservableFrom = from(res.set(subscription.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }
  updateTemplate(otemplate: template): Observable<any> {
    const res = this.db.collection('/templates')
      .doc(otemplate.id)
    var ObservableFrom = from(res.set(otemplate.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }
  updateCourse(course: Courses): Observable<any> {
    const res = this.db.collection('/courses')
      .doc(course.id)
    var ObservableFrom = from(res.set(course.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }
  updateCoupon(coupon: coupons): Observable<any> {
    const res = this.db.collection('/coupons')
      .doc(coupon.id)
    var ObservableFrom = from(res.set(coupon.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }


  updateRole(role: Roles): Observable<any> {
    const res = this.db.collection('/roles').doc(role.id)
    var ObservableFrom = from(res.set(role.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }

  updateDailyTicker(dailyticker: dailyticker, broadcast: broadcastinfo): Observable<any> {
    const res = this.db.collection('/dailytrade').doc(dailyticker.id)
    var ObservableFrom = from(res.set(dailyticker.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }

  updateOptionsTrade(optionstrade: optionstrade): Observable<any> {
    const res = this.db.collection('/optionstrade').doc(optionstrade.id)
    var ObservableFrom = from(res.set(optionstrade.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }
  updateOptionsTradeNotes(optionstrade: optionstrade, notesArray: optionstradenotes[], stocknotesArray: optionstradenotes[]): Observable<any> {
    const notes = notesArray.map((obj) => { return Object.assign({}, obj) });
    const stocknotes = stocknotesArray.map((obj) => { return Object.assign({}, obj) });
    console.log(optionstrade);
    var res = this.db.collection('/optionstrade').doc(optionstrade.id);
    //if (optionstrade.isactive === false) {
      let oOptionstradeedit: optionstradeedit = new optionstradeedit(optionstrade.id,
        optionstrade.symbol, optionstrade.spread, optionstrade.createdby,
        optionstrade.createdon, optionstrade.postedby, optionstrade.type, optionstrade.isactive,
        optionstrade.currentStockPrice, optionstrade.aboveResistance, optionstrade.belowResistance, optionstrade.stopLoss, optionstrade.support, optionstrade.postedFor,
        optionstrade.isstockactive, optionstrade.isoptionactive, optionstrade.optionsellprice, optionstrade.optionexitdate,
        optionstrade.stocksellprice, optionstrade.stockexitdate, optionstrade.broadcastTrade
      );
      var ObservableFrom;
      if (notes.length > 0) {
        ObservableFrom = from(res.set(oOptionstradeedit.toPlainObj(), { merge: true }).then(function () {
          res.update({ notes: firebase.firestore.FieldValue.arrayUnion(...notes) });
        })
          .catch(function (error) {
            console.log(error);
          }))
      }

      if (stocknotes.length > 0) {
        ObservableFrom = from(res.set(oOptionstradeedit.toPlainObj(), { merge: true }).then(function () {
          res.update({ stocknotes: firebase.firestore.FieldValue.arrayUnion(...stocknotes) });
        })
          .catch(function (error) {
            console.log(error);
          }))
      }

      return ObservableFrom;

   // }
   // else {
   //   ObservableFrom = from(res.update({ notes: firebase.firestore.FieldValue.arrayUnion(...notes) }));
   //   ObservableFrom = from(res.update({ stocknotes: firebase.firestore.FieldValue.arrayUnion(...stocknotes) }));
      //var ObservableFrom = from(res.update({ 'notes': firebase.firestore.FieldValue.arrayRemove(...notes) }));
    //  return ObservableFrom;
   // }
  }

  public sendToAzure = (tradeData: TradeData): Observable<any> => {
    //const url = `${serviceUrl}sendtelegram`;
    const url = `${azureServiceUrl}api/trade/InsertTrade`;
    return this.http
      .post(url, JSON.stringify(tradeData), httpOptions)
      .pipe(map((r: any) => r));
  }

  public sendTelegramMessage = (broadcast: broadcastinfo): Observable<any> => {
    //const url = `${serviceUrl}sendtelegram`;
    const url = `${serviceUrl}send-telegramtask`;
    return this.http
      .post(url, JSON.stringify(broadcast), httpOptions)
      .pipe(map((r: any) => r));
  }

  printObject(obj: any): void {
    const keys = Object.keys(obj)
    const values = keys.map(key => `${key}</b>: ${Reflect.get(obj, key)}`)
    console.log(values)
  }


  async updateChannel(channel: channel) {
    const channelgroups = channel.channelgroup.map((obj) => { return Object.assign({}, obj) });
    var channeldto: channelDTO = new channelDTO(channel.id, channel.createdby, channel.createdon, channel.accountsid, channel.authtoken, channel.name, channel.membergroup);
    const res = this.db.collection('/channels').doc(channel.id);
    res.set(channeldto.toPlainObj()).then(function () {
      res.set({ 'channelgroup': channelgroups }, { merge: true });
    })
      .catch(function (error) {
        console.log(error);
      })
  }


  addSubscription(subscription: ServiceSubscription): Observable<any> {
    const res = this.db.collection('/subscription').doc(subscription.id)
    var ObservableFrom = from(res.set(subscription.toPlainObj()));
    return ObservableFrom;
  }

  addTemplate(otemplate: template): Observable<any> {
    const res = this.db.collection('/templates').doc(otemplate.id)
    var ObservableFrom = from(res.set(otemplate.toPlainObj()));
    return ObservableFrom;
  }

  addCourse(course: Courses): Observable<any> {
    const res = this.db.collection('/courses').doc(course.id)
    var ObservableFrom = from(res.set(course.toPlainObj()));
    return ObservableFrom;
  }

  addRole(roles: Roles): Observable<any> {
    const res = this.db.collection('/roles').doc(roles.id)
    var ObservableFrom = from(res.set(roles.toPlainObj()));
    return ObservableFrom;
  }

  addDailyTicker(dailyticker: dailyticker, broadcast: broadcastinfo): Observable<any> {
    console.log(broadcast);
    const res = this.db.collection('/dailytrade').doc(dailyticker.id)
    var ObservableFrom = from(res.set(dailyticker.toPlainObj()));
    return ObservableFrom;
  }

  addOptionsTrade(optionstrade: optionstrade): Observable<any> {
    const notes = optionstrade.notes.map((obj) => { return Object.assign({}, obj) });
    const trans = optionstrade.trans.map((obj) => { return Object.assign({}, obj) });
    const stokenotes = optionstrade.stocknotes.map((obj) => { return Object.assign({}, obj) });

    let oOptionstradeedit: optionstradeedit = new optionstradeedit(optionstrade.id,
      optionstrade.symbol, optionstrade.spread, optionstrade.createdby, optionstrade.createdon, optionstrade.postedby, optionstrade.type, optionstrade.isactive,
      optionstrade.currentStockPrice, optionstrade.aboveResistance, optionstrade.belowResistance, optionstrade.stopLoss, optionstrade.support, optionstrade.postedFor,
      optionstrade.isstockactive, optionstrade.isoptionactive, optionstrade.optionsellprice, optionstrade.optionexitdate, optionstrade.stocksellprice, optionstrade.stockexitdate,
      optionstrade.broadcastTrade,optionstrade.stockoftheday
    );
    var res = this.db.collection('/optionstrade').doc(optionstrade.id);
    var ObservableFrom = from(res.set(oOptionstradeedit.toPlainObj()).then(function () {
      res.set({ 'notes': notes }, { merge: true });
      res.set({ 'trans': trans }, { merge: true });
      res.set({ 'stocknotes': stokenotes }, { merge: true });

    })
      .catch(function (error) {
        console.log(error);
      }))
    return ObservableFrom;
  }

  async addChannel(channel: channel) {
    const channelgroups = channel.channelgroup.map((obj) => { return Object.assign({}, obj) });
    var channeldto: channelDTO = new channelDTO(channel.id, channel.createdby, channel.createdon, channel.accountsid, channel.authtoken, channel.name,channel.membergroup);
    const res = this.db.collection('/channels').doc(channel.id);
    res.set(channeldto.toPlainObj()).then(function () {
      res.set({ 'channelgroup': channelgroups }, { merge: true });
    })
      .catch(function (error) {
        console.log(error);
      })
  }

  addCoupon(coupon: coupons): Observable<any> {
    const res = this.db.collection('/coupons').doc(coupon.id)
    var ObservableFrom = from(res.set(coupon.toPlainObj()));
    return ObservableFrom;
  }

  deleteChannel(channel: channel): Observable<any> {
    const res = this.db.collection('/channels')
      .doc(channel.id)
    var ObservableFrom = from(res.set(channel.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }
  deleteTemplate(otemplate: template): Observable<any> {
    const res = this.db.collection('/templates')
      .doc(otemplate.id)
    var ObservableFrom = from(res.set(otemplate.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }

  deletecoupon(coupon: coupons): Observable<any> {
    const res = this.db.collection('/coupons')
      .doc(coupon.id)
    var ObservableFrom = from(res.set(coupon.toPlainObj(), { merge: true }));
    return ObservableFrom;
  }



  deleteDailyTicker(dailyticker: dailyticker): Observable<any> {
    const res = this.db.collection('/dailytrade')
      .doc(dailyticker.id)
    var ObservableFrom = from(res.set(dailyticker.toPlainObj(), { merge: true }));

    //var ObservableFrom = from(res.delete());
    return ObservableFrom;
    //.then(function () {
    //  console.log("Document successfully written!");
    //})
    //.catch(function (error) {
    //  console.error("Error writing document: ", error);
    //});
  }

  deleteOptionsTrade(optionstrade: optionstrade): Observable<any> {
    const res = this.db.collection('/optionstrade')
      .doc(optionstrade.id)
    //var ObservableFrom = from(res.set(optionstrade.toPlainObj(), { merge: true }));
    var ObservableFrom = from(res.delete());
    return ObservableFrom;
    //.then(function () {
    //  console.log("Document successfully written!");
    //})
    //.catch(function (error) {
    //  console.error("Error writing document: ", error);
    //});
  }


  deleteSubscription(subscription: ServiceSubscription): Observable<any> {
    const res = this.db.collection('/subscription')
      .doc(subscription.id)
    var ObservableFrom = from(res.delete());
    return ObservableFrom;
    //.then(function () {
    //  console.log("Document successfully written!");
    //})
    //.catch(function (error) {
    //  console.error("Error writing document: ", error);
    //});
  }

  deleteRole(role: Roles): Observable<any> {
    const res = this.db.collection('/roles')
      .doc(role.id)
    var ObservableFrom = from(res.delete());
    return ObservableFrom;
    //.then(function () {
    //  console.log("Document successfully written!");
    //})
    //.catch(function (error) {
    //  console.error("Error writing document: ", error);
    //});



  }


  GetUserData(uid): AngularFirestoreCollection<userprofile> {
    let booksCollection: AngularFirestoreCollection<userprofile>;
    return booksCollection = this.db.collection('userprofile', ref => ref.where('uid', '==', uid));
  }

  async GetSubscriptions() {
    const subscriptionsRef = await this.db.collection('subscription').ref.get();
    return new Promise<Subscription[]>(resolve => {
      const v = subscriptionsRef.docs.map(x => {
        const obj = x.data();
        obj.id = x.id;
        return obj as Subscription;
      });
      resolve(v);
    });
  }

  async GetTradingTools() {
    const subscriptionsRef = await this.db.collection('tradingtools').ref.get();
    return new Promise<tradingtools[]>(resolve => {
      const v = subscriptionsRef.docs.map(x => {
        const obj = x.data();
        obj.id = x.id;
        return obj as tradingtools;
      });
      resolve(v);
    });
  }
}
