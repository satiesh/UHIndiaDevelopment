import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
  import { mergeMap } from 'rxjs/operators';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging)
  {
    //this.angularFireMessaging.messages.subscribe(
    //  (_messaging: AngularFireMessaging) => {
    //    _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //    _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //  }
    //)
  }

  //private updateToken(token) {
  //  this.authService.afAuth.authState.subscribe(user => {
  //    if (!user) return;
  //    const data = { [user.uid]: token }
  //    this.

  //  });
  //}

  deleteToken() {
    this.angularFireMessaging.getToken
      .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
      .subscribe(
        (token) => { console.log('Token deleted!'); },
      );
  }

  requestPermission(): string {
    let strToken: string='';
    this.angularFireMessaging.requestToken
      .subscribe(
        (token) => { strToken=token; console.log(strToken) },
        (error) => { console.error(error); },
      );
    //this.angularFireMessaging.requestPermission.subscribe(data => {
    //  console.log("requestPermission "+ data)});
    //this.angularFireMessaging.requestToken.subscribe(
    //  (token) => {
    //    return token;
    //    console.log(token);
    //  },
    //  (err) => {
    //    console.error('Unable to get permission to notify.', err);
    //  }
    //);
    return strToken;
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        //setTimeout(() => {
        //  if (payload) {
        //    //this.alertService.resetStickyMessage();
        //    console.log(payload["notification"]["title"]);
        //    this.alertService.showMessage(payload["notification"]["title"], payload["notification"]["body"], MessageSeverity.info);
        //  }
        //}, 10000);
        this.currentMessage.next(payload);
      })
  }
}
