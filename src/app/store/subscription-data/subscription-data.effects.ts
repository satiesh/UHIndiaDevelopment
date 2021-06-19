/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './subscription-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AccountService, AppService } from '@app/services';
import { dispatch } from 'rxjs/internal/observable/range';


@Injectable()
export class SubscriptionDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.SubscriptionRequestAction>(
      featureActions.ActionTypes.GET_SUBSCRIPTION_REQUEST
    ),
    switchMap(action =>
      this.appService.getsubscriptions()
        .pipe(
          take(1),
          map(
            subscriptionData => new featureActions.SubscriptionSuccessAction({
              subscriptionData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.SubscriptionFailureAction({ error })))
        )
    )
  );

  @Effect()
  addSubscriptionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddSubscriptionRequestAction>(featureActions.ActionTypes.ADD_SUBSCRIPTION_REQUEST),
    switchMap(action =>
      this.appService.addSubscription(action.payload)
        .pipe(
          take(1),
          map(returnData => new featureActions.AddSubscriptionSuccessAction(action.payload)),
         catchError(error => observableOf(new featureActions.SubscriptionFailureAction({ error })))
        )
    ),

  );

  @Effect()
  deleteSubscriptionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteSubscriptionRequestAction>(featureActions.ActionTypes.DELETE_SUBSCRIPTION_REQUEST),
    switchMap(action => {
      const ref = this.appService.deleteSubscription(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.DeleteSubscriptionSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.SubscriptionFailureAction({ error })))
        )
    }),

  );


  @Effect()
  updateSubscriptionEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateSubscriptionRequestAction>(featureActions.ActionTypes.UPDATE_SUBSCRIPTION_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateSubscription(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateSubscriptionSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.SubscriptionFailureAction({ error })))
        )
    }),

  );
};
