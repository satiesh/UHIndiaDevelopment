/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import * as featureActions from './investorlevel-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class InvestorLevelDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.InvestorLevelRequestAction>(
      featureActions.ActionTypes.GET_INVESTORLEVEL_REQUEST
    ),
    switchMap(action =>
      this.appService.getinvestorlevel()
        .pipe(
          take(1),
          map(
            investorlevelData=> new featureActions.InvestorLevelSuccessAction({
              investorlevelData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.InvestorLevelFailureAction({ error })))
        )
    )
  );
}
