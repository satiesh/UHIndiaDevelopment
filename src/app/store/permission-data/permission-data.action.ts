/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { Permission } from '@app/models';



export enum ActionTypes {
  GET_PERMISSIONS_REQUEST = '[Permissions Data] Get Permissions Request',
  GET_PERMISSIONS_FAILURE = '[Permissions Data] Get Permissions Failure',
  GET_PERMISSIONS_SUCCESS = '[Permissions Data] Get Permissions Success'
}

export class PermissionsRequestAction implements Action {
  readonly type = ActionTypes.GET_PERMISSIONS_REQUEST;
}

export class PermissionsFailureAction implements Action {
  readonly type = ActionTypes.GET_PERMISSIONS_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class PermissionsSuccessAction implements Action {
  readonly type = ActionTypes.GET_PERMISSIONS_SUCCESS;
  constructor(public payload: { permissionsData: Permission[] }) { }
}

export type Actions = PermissionsRequestAction | PermissionsFailureAction | PermissionsSuccessAction;
