/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import * as featureActions from './tradingtools-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class TradingToolsDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.ToolsTradingRequestAction>(
      featureActions.ActionTypes.GET_TRADINGTOOLS_REQUEST
    ),
    switchMap(action =>
      this.appService.gettradingTools()
        .pipe(
          take(1),
          map(
            tradingtoolsData=> new featureActions.ToolsTradingSuccessAction({
              tradingtoolsData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.ToolsTradingFailureAction({ error })))
        )
    )
  );
}
