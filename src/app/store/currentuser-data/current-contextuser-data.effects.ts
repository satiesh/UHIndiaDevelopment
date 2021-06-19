/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './current-contextuser-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AccountService } from '@app/services';


@Injectable()
export class CurrentUsersDataEffects {
  constructor(private accountService: AccountService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CurrentUsersRequestAction>(
      featureActions.ActionTypes.GET_CURRENT_USER_REQUEST
    ),
    switchMap(action =>
      this.accountService.getcurrentuser(action.payload)
        .pipe(
          take(1),
          map(
            user => new featureActions.CurrentUsersSuccessAction(user)
          ),
          catchError(error =>
            observableOf(new featureActions.CurrentUsersFailureAction({ error })))
        )
    )
  );
  @Effect()
  updateCurrentUserMessageEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUsersNotificationRequestAction>(featureActions.ActionTypes.UPDATE_USER_NOTIFICATION_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserMessaging(action.payload.uid, action.payload.usermessaging)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateUsersNotificationSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CurrentUsersFailureAction({ error })))
        )
    }),
  );
  @Effect()
  updateCurrentUserDisclaimerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUserDisclaimerRequestAction>(featureActions.ActionTypes.UPDATE_USER_DISCLAIMER_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserDiscalimer(action.payload.uid, action.payload.userdisclaimer, action.payload.userquestions)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(disclaimerData => new featureActions.UpdateUserDisclaimerSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CurrentUsersFailureAction({ error })))
        )
    }),
  );
  @Effect()
  updateCurrentUserSubscriptionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUsersSubscriptionRequestAction>(featureActions.ActionTypes.UPDATE_USER_SUBSCRIPTION_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserSubscription(action.payload.uid, action.payload.usersubscription, action.payload.userpayment)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateUsersSubscriptionSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CurrentUsersFailureAction({ error })))
        )
    }),
  );
  @Effect()
  updateCurrentUserProfileEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUsersProfileRequestAction>(featureActions.ActionTypes.UPDATE_USER_PROFILE_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserProfile(action.payload, action.payload.userprofile)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(profiledata => new featureActions.UpdateUsersProfileSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CurrentUsersFailureAction({ error })))
        )
    }),
  );
  @Effect()
  updateCurrentUserOtheValuesEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUsersOtherValuesRequestAction>(featureActions.ActionTypes.UPDATE_USER_OTHERVALUES_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserOtherValues(action.payload.uid, action.payload.userothervalues)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(profiledata => new featureActions.UpdateUsersOtherValuesSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CurrentUsersFailureAction({ error })))
        )
    }),
  );
}
