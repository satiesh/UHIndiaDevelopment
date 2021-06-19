/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './coupon-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class CouponDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CouponRequestAction>(
      featureActions.ActionTypes.GET_COUPON_REQUEST
    ),
    switchMap(action =>
      this.appService.getcoupons()
        .pipe(
          take(1),
          map(
            couponsData => new featureActions.CouponSuccessAction({
              couponsData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.CouponFailureAction({ error })))
        )
    )
  );
  @Effect()
  updateCouponProfileEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateCouponRequestAction>(featureActions.ActionTypes.UPDATE_COUPON_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateCoupon(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(profiledata => new featureActions.UpdateCouponSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CouponFailureAction({ error })))
        )
    }),
  );

  @Effect()
  addRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddCouponRequestAction>(
      featureActions.ActionTypes.ADD_COUPON_REQUEST
    ),
    switchMap(action =>
      this.appService.addCoupon(action.payload)
        .pipe(
          take(1),
          map(subscriptionData => new featureActions.AddCouponSuccessAction(action.payload)),
          catchError(error =>
            observableOf(new featureActions.CouponFailureAction({ error })))
        )
    )
  );
  @Effect()
  deleteRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteCouponRequestAction>(
      featureActions.ActionTypes.DELETE_COUPON_REQUEST
    ),
    switchMap(action =>
      this.appService.deletecoupon(action.payload)
        .pipe(
          take(1),
          map(subscriptionData => new featureActions.DeleteCouponSuccessAction(action.payload)),
          catchError(error =>
            observableOf(new featureActions.CouponFailureAction({ error })))
        )
    )
  );
}
