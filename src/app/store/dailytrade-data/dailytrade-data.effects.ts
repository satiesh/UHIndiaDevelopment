/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './dailytrade-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class DailyTickerDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DailyTickerRequestAction>(
      featureActions.ActionTypes.GET_DAILYTICKER_REQUEST
    ),
    switchMap(action =>
      this.appService.getdailyTrade()
        .pipe(
          take(1),
          map(
            dailytickerData=> new featureActions.DailyTickerSuccessAction({
              dailytickerData 
            })
          ),
          catchError(error =>
            observableOf(new featureActions.DailyTickerFailureAction({ error })))
        )
    )
  );


  @Effect()
  addDailyTickerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddDailyTickerRequestAction>(featureActions.ActionTypes.ADD_DAILYTICKER_REQUEST),
    switchMap(action =>
      this.appService.addDailyTicker(action.payload.dailyticker, action.payload.channeldisplay)
        .pipe(
          take(1),
          map(returnData => new featureActions.AddDailyTickerSuccessAction(action.payload.dailyticker)),
          catchError(error => observableOf(new featureActions.DailyTickerFailureAction({ error })))
        )
    ),

  );

  @Effect()
  deleteDailyTickerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteDailyTickerRequestAction>(featureActions.ActionTypes.DELETE_DAILYTICKER_REQUEST),
    switchMap(action => {
      const ref = this.appService.deleteDailyTicker(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.DeleteDailyTickerSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.DailyTickerFailureAction({ error })))
        )
    }),

  );


  @Effect()
  updateDailyTickerEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateDailyTickerRequestAction>(featureActions.ActionTypes.UPDATE_DAILYTICKER_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateDailyTicker(action.payload.dailyticker, action.payload.channeldisplay)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateDailyTickerSuccessAction(action.payload.dailyticker)),
          catchError(error => observableOf(new featureActions.DailyTickerFailureAction({ error })))
        )
    }),

  );

}
