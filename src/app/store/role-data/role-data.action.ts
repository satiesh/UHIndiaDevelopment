/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { Roles, Permission } from '@app/models';



export enum ActionTypes {
  GET_ROLES_REQUEST = '[Roles Data] Get Roles Request',
  GET_ROLES_SUCCESS = '[Roles Data] Get Roles Success',
  ADD_ROLES_REQUEST = '[Roles Data] Add Roles Request',
  ADD_ROLES_SUCCESS = '[Roles Data] Add Roles Success',
  UPDATE_ROLES_REQUEST = '[Roles Data] Update Roles Request',
  UPDATE_ROLES_SUCCESS = '[Roles Data] Update Roles Success',
  DELETE_ROLES_REQUEST = '[Roles Data] Delete Roles Request',
  DELETE_ROLES_SUCCESS = '[Roles Data] Delete Roles Success',
  ROLES_ACTION_FAILURE = '[Roles Data] Roles Action Failure',
}

export class RolesRequestAction implements Action {
  readonly type = ActionTypes.GET_ROLES_REQUEST;
}

export class RolesSuccessAction implements Action {
  readonly type = ActionTypes.GET_ROLES_SUCCESS;
  constructor(public payload: { rolesData: Roles[] }) { }
}

export class AddRoleRequestAction implements Action {
  readonly type = ActionTypes.ADD_ROLES_REQUEST;
  constructor(public payload: Roles) { }
}

export class AddRoleSuccessAction implements Action {
  readonly type = ActionTypes.ADD_ROLES_SUCCESS;
  constructor(public payload: Roles) { }
}

export class UpdateRoleRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_ROLES_REQUEST;
  constructor(public payload: Roles) { }
}

export class UpdateRoleSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_ROLES_SUCCESS;
  constructor(public payload: Roles) { }
}

export class DeleteRoleRequestAction implements Action {
  readonly type = ActionTypes.DELETE_ROLES_REQUEST;
  constructor(public payload: Roles) { }
}

export class DeleteRoleSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_ROLES_SUCCESS;
  constructor(public payload: Roles) { }
}

export class RolesFailureAction implements Action {
  readonly type = ActionTypes.ROLES_ACTION_FAILURE;
  constructor(public payload: { error: string }) { }
}


export type Actions =
  | RolesRequestAction
  | RolesSuccessAction
  | AddRoleRequestAction
  | AddRoleSuccessAction
  | UpdateRoleRequestAction
  | UpdateRoleSuccessAction
  | DeleteRoleRequestAction
  | DeleteRoleSuccessAction
  | RolesFailureAction;
