/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import * as featureActions from './role-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AccountService, AppService } from '@app/services';


@Injectable()
export class RolesDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.RolesRequestAction>(
      featureActions.ActionTypes.GET_ROLES_REQUEST
    ),
    switchMap(action =>
      this.appService.getroles()
        .pipe(
          take(1),
          map(
            rolesData => new featureActions.RolesSuccessAction({
              rolesData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.RolesFailureAction({ error })))
        )
    )
  );

  @Effect()
  addRoleEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddRoleRequestAction>(featureActions.ActionTypes.ADD_ROLES_REQUEST),
    switchMap(action =>
      this.appService.addRole(action.payload)
        .pipe(
          take(1),
          map(returnData => new featureActions.AddRoleSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.RolesFailureAction({ error })))
        )
    ),

  );

  @Effect()
  deleteRoleEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteRoleRequestAction>(featureActions.ActionTypes.DELETE_ROLES_REQUEST),
    switchMap(action => 
      this.appService.deleteRole(action.payload)
        .pipe(
          map(subscriptionData => new featureActions.DeleteRoleSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.RolesFailureAction({ error })))
        )
    ),

  );

  @Effect()
  updateRoleEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateRoleRequestAction>(featureActions.ActionTypes.UPDATE_ROLES_REQUEST),
    switchMap(action => 
      this.appService.updateRole(action.payload)
        .pipe(
          map(subscriptionData => new featureActions.UpdateRoleSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.RolesFailureAction({ error })))
        )
    ),
  );
}
