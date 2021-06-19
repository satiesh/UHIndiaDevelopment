/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { User } from '@app/models/User';
import { useroptiontrades } from '../../models/useroptiontrade';



export enum ActionTypes {
  GET_USERS_REQUEST = '[Users Data] Get Users Request',
  GET_USERS_SUCCESS = '[Users Data] Get Users Success',
  GET_USERS_OPTIONSTRADE_REQUEST = '[Users Data] Get Users Options trade Request',
  GET_USERS_OPTIONSTRADE_SUCCESS = '[Users Data] Get Users Options trade Success',
  ADD_USERS_REQUEST = '[Users Data] Add User Request',
  ADD_USERS_SUCCESS = '[Users Data] Add User Success',
  UPDATE_USER_REQUEST = '[Users Data] Update User Request',
  UPDATE_USER_SUCCESS = '[Users Data] Update User Success',

  UPDATE_USER_PROFILE_REQUEST = '[Users Data] Update User Profile Request',
  UPDATE_USER_PROFILE_SUCCESS = '[Users Data] Update User Profile Success',
  UPDATE_USER_SUBSCRIPTION_REQUEST = '[Users Data] Update User Subscription Request',
  UPDATE_USER_SUBSCRIPTION_SUCCESS = '[Users Data] Update User Subscription Success',
  UPDATE_USER_ROLE_REQUEST = '[Users Data] Update User Role Request',
  UPDATE_USER_ROLE_SUCCESS = '[Users Data] Update User Role Success',
  UPDATE_USER_OTHERVALUES_REQUEST = '[Users Data] Update User Other Values Request',
  UPDATE_USER_OTHERVALUES_SUCCESS = '[Users Data] Update User Other Values Success',

  DISABLE_USERS_REQUEST = '[Users Data] Disable User Request',
  DISABLE_USERS_SUCCESS = '[Users Data] Disable User Success',

  DELETE_USERS_REQUEST = '[Users Data] Delete User Request',
  DELETE_USERS_SUCCESS = '[Users Data] Delete User Success',
  USERS_FAILURE = '[Users Data] Get Users Failure'

}

export class UsersRequestAction implements Action {
  readonly type = ActionTypes.GET_USERS_REQUEST;
}
export class UsersSuccessAction implements Action {
  readonly type = ActionTypes.GET_USERS_SUCCESS;
  constructor(public payload: { usersData: User[] }) { }
}

export class UsersOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.GET_USERS_OPTIONSTRADE_REQUEST;
}
export class UsersOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.GET_USERS_OPTIONSTRADE_SUCCESS;
  constructor(public payload: { useroptiontrades: useroptiontrades[] }) { }
}

export class AddUsersRequestAction implements Action {
  readonly type = ActionTypes.ADD_USERS_REQUEST;
  constructor(public payload: User) { }
}
export class AddUsersSuccessAction implements Action {
  readonly type = ActionTypes.ADD_USERS_SUCCESS;
  constructor(public payload: User) { }
}

export class UpdateUserRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUserSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_SUCCESS;
  constructor(public payload: User) { }
}


export class UpdateUserProfileRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_PROFILE_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUserProfileSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_PROFILE_SUCCESS;
  constructor(public payload: User) { }
}

export class UpdateUsersSubscriptionRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_SUBSCRIPTION_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUsersSubscriptionSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_SUBSCRIPTION_SUCCESS;
  constructor(public payload: User) { }
}

export class UpdateUserRoleRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_ROLE_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUserRoleSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_ROLE_SUCCESS;
  constructor(public payload: User) { }
}
export class UpdateUsersOtherValuesRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_OTHERVALUES_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUsersOtherValuesSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_OTHERVALUES_SUCCESS;
  constructor(public payload: User) { }
}

export class DeleteUsersRequestAction implements Action {
  readonly type = ActionTypes.DELETE_USERS_REQUEST;
  constructor(public payload: User) { }
}
export class DeleteUsersSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_USERS_SUCCESS;
  constructor(public payload: User) { }
}

export class DisableUsersRequestAction implements Action {
  readonly type = ActionTypes.DISABLE_USERS_REQUEST;
  constructor(public payload: User) { }
}
export class DisableUsersSuccessAction implements Action {
  readonly type = ActionTypes.DISABLE_USERS_SUCCESS;
  constructor(public payload: User) { }
}

export class UsersFailureAction implements Action {
  readonly type = ActionTypes.USERS_FAILURE;
  constructor(public payload: { error: string }) { }
}



export type Actions =
  | UsersRequestAction
  | UsersSuccessAction
  | AddUsersRequestAction
  | AddUsersSuccessAction
  | UpdateUserRequestAction
  | UpdateUserSuccessAction
  | UpdateUserProfileRequestAction
  | UpdateUserProfileSuccessAction
  | UpdateUserRoleRequestAction
  | UpdateUserRoleSuccessAction
  | UpdateUsersSubscriptionRequestAction
  | UpdateUsersSubscriptionSuccessAction
  | UsersOptionsTradeRequestAction
  | UsersOptionsTradeSuccessAction
  | DeleteUsersRequestAction
  | DeleteUsersSuccessAction
  | DisableUsersRequestAction
  | DisableUsersSuccessAction
  | UsersFailureAction
  | UpdateUsersOtherValuesRequestAction
  | UpdateUsersOtherValuesSuccessAction;
