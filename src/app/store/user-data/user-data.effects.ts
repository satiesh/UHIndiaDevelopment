/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './user-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AccountService } from '@app/services';


@Injectable()
export class UsersDataEffects {
  constructor(private accountService: AccountService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UsersRequestAction>(
      featureActions.ActionTypes.GET_USERS_REQUEST
    ),
    switchMap(action =>
      this.accountService.getusers()
        .pipe(
          take(1),
          map(
            usersData => new featureActions.UsersSuccessAction({
              usersData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.UsersFailureAction({ error })))
        )
    )
  );
  @Effect()
  updateUserEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUserRequestAction>(featureActions.ActionTypes.UPDATE_USER_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserFormList(action.payload, action.payload.userprofile,action.payload.userroles,action.payload.userothervalues)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(profiledata => new featureActions.UpdateUserSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
        )
    }),
  );
  @Effect()
  updateUserProfileEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUserProfileRequestAction>(featureActions.ActionTypes.UPDATE_USER_PROFILE_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserProfile(action.payload, action.payload.userprofile)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(profiledata => new featureActions.UpdateUserProfileSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
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
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
        )
    }),
  );
  @Effect()
  updateUserRoleEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUserRoleRequestAction>(featureActions.ActionTypes.UPDATE_USER_ROLE_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateUserRole(action.payload.uid, action.payload.userroles)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(profiledata => new featureActions.UpdateUserRoleSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
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
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
        )
    }),
  );

  @Effect()
  disableUserEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DisableUsersRequestAction>(featureActions.ActionTypes.DISABLE_USERS_REQUEST),
    switchMap(action => {
      const ref = this.accountService.disableUser(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.DisableUsersSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
        )
    }),
  );

  @Effect()
  deleteRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteUsersRequestAction>(
      featureActions.ActionTypes.DELETE_USERS_REQUEST
    ),
    switchMap(action =>
      this.accountService.deleteusers(action.payload)
        .pipe(
          take(1),
          map(subscriptionData => new featureActions.DeleteUsersSuccessAction(action.payload)),
          catchError(error =>
            observableOf(new featureActions.UsersFailureAction({ error })))
        )
    )
  );
}
