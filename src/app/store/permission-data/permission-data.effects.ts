/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import * as featureActions from './permission-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class PermissionsDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.PermissionsRequestAction>(
      featureActions.ActionTypes.GET_PERMISSIONS_REQUEST
    ),
    switchMap(action =>
      this.appService.getpermissions()
        .pipe(
          take(1),
          map(
            permissionsData => new featureActions.PermissionsSuccessAction({
              permissionsData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.PermissionsFailureAction({ error })))
        )
    )
  );
}
