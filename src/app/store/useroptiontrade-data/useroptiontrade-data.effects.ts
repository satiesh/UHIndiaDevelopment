/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './useroptiontrade-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AccountService } from '@app/services';


@Injectable()
export class UserOptionTradeDataEffects {
  constructor(private accountService: AccountService, private actions$: Actions) { }

  @Effect()
  loadRequestOptionsTradeEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UsersOptionsTradeRequestAction>(
      featureActions.ActionTypes.GET_USERS_OPTIONSTRADE_REQUEST
    ),
    switchMap(action =>
      this.accountService.getuseroptions(action.payload.uid)
        .pipe(
          take(1),
          map(
            useroptiontrades => new featureActions.UsersOptionsTradeSuccessAction({
              useroptiontrades
            })
          ),
          catchError(error =>
            observableOf(new featureActions.UsersFailureAction({ error })))
        )
    )
  );

  @Effect()
  addUserOptionsTradeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddUsersOptionsTradeRequestAction>(featureActions.ActionTypes.ADD_USERS_OPTIONSTRADE_REQUEST),
    switchMap(action =>
      this.accountService.adduseroptions(action.payload)
        .pipe(
          take(1),
          map(returnData => new featureActions.AddUsersOptionsTradeSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
        )
    ),

  );


  @Effect()
  updateUserOptionsTradeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateUsersOptionsTradeRequestAction>(featureActions.ActionTypes.UPDATE_USERS_OPTIONSTRADE_REQUEST),
    switchMap(action => {
      const ref = this.accountService.updateuseroptions(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateUsersOptionsTradeSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.UsersFailureAction({ error })))
        )
    }),

  );
 
}
