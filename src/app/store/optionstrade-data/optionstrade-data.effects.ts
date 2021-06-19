/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './optionstrade-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class OptionsTradeDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.OptionsTradeRequestAction>(
      featureActions.ActionTypes.GET_OPTIONSTRADE_REQUEST
    ),
    switchMap(action =>
      this.appService.getoptionsTrade()
        .pipe(
          take(1),
          map(
            optionstradeData => new featureActions.OptionsTradeSuccessAction({
              optionstradeData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.OptionsTradeFailureAction({ error })))
        )
    )
  );

  @Effect()
  loadStockOfTheDayRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DailyStockTradeRequestAction>(
      featureActions.ActionTypes.GET_DAILYSTOCKTRADE_REQUEST
    ),
    switchMap(action =>
      this.appService.getoptionsTrade()
        .pipe(
          take(1),
          map(
            optionstradeData => new featureActions.DailyStockTradeSuccessAction({
              optionstradeData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.DailyStockTradeFailureAction({ error })))
        )
    )
  );

  @Effect()
  addOptionsTradeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddOptionsTradeRequestAction>(featureActions.ActionTypes.ADD_OPTIONSTRADE_REQUEST),
    switchMap(action =>
      this.appService.addOptionsTrade(action.payload.optionstrade)
        .pipe(
          take(1),
          map(returnData => new featureActions.AddOptionsTradeSuccessAction(action.payload.optionstrade)),
          catchError(error => observableOf(new featureActions.OptionsTradeFailureAction({ error })))
        )
    ),

  );

  @Effect()
  deleteOptionsTradeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteOptionsTradeRequestAction>(featureActions.ActionTypes.DELETE_OPTIONSTRADE_REQUEST),
    switchMap(action => {
      const ref = this.appService.deleteOptionsTrade(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.DeleteOptionsTradeSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.OptionsTradeFailureAction({ error })))
        )
    }),

  );


  @Effect()
  updateOptionsTradeEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateOptionsTradeRequestAction>(featureActions.ActionTypes.UPDATE_OPTIONSTRADE_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateOptionsTrade(action.payload.optionstrade)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateOptionsTradeSuccessAction(action.payload.optionstrade)),
          catchError(error => observableOf(new featureActions.OptionsTradeFailureAction({ error })))
        )
    }),

  );

  @Effect()
  updateOptionsTradeNotesEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateOptionsTradeNoteRequestAction>(featureActions.ActionTypes.UPDATE_OPTIONSTRADE_NOTES_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateOptionsTradeNotes(action.payload.optionstrade, action.payload.notes,action.payload.stocknotes);
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateOptionsTradeSuccessAction(action.payload.optionstrade)),
          catchError(error => observableOf(new featureActions.OptionsTradeFailureAction({ error })))
        )
    }),

  );
}
