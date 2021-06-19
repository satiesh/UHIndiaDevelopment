/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { useroptiontrades } from '../../models/useroptiontrade';



export enum ActionTypes {
  GET_USERS_OPTIONSTRADE_REQUEST = '[Users Data] Get Users Options trade Request',
  GET_USERS_OPTIONSTRADE_SUCCESS = '[Users Data] Get Users Options trade Success',
  ADD_USERS_OPTIONSTRADE_REQUEST = '[Users Data] Add User Options trade Request',
  ADD_USERS_OPTIONSTRADE_SUCCESS = '[Users Data] Add User Options trade Success',
  UPDATE_USERS_OPTIONSTRADE_REQUEST = '[Users Data] Update User Options trade Request',
  UPDATE_USERS_OPTIONSTRADE_SUCCESS = '[Users Data] Update User Options trade Success',
  USERS_FAILURE = '[Users Data] Get Users Failure'

}


export class UsersOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.GET_USERS_OPTIONSTRADE_REQUEST;
  constructor(public payload: { uid: string }) { }
}
export class UsersOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.GET_USERS_OPTIONSTRADE_SUCCESS;
  constructor(public payload: { useroptiontrades: useroptiontrades[] }) { }
}

export class AddUsersOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.ADD_USERS_OPTIONSTRADE_REQUEST;
  constructor(public payload: useroptiontrades) { }
}
export class AddUsersOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.ADD_USERS_OPTIONSTRADE_SUCCESS;
  constructor(public payload: useroptiontrades) { }
}

export class UpdateUsersOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USERS_OPTIONSTRADE_REQUEST;
  constructor(public payload: useroptiontrades) { }
}
export class UpdateUsersOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USERS_OPTIONSTRADE_SUCCESS;
  constructor(public payload: useroptiontrades) { }
}

export class UsersFailureAction implements Action {
  readonly type = ActionTypes.USERS_FAILURE;
  constructor(public payload: { error: string }) { }
}



export type Actions =
  | UsersOptionsTradeRequestAction
  | UsersOptionsTradeSuccessAction
  | AddUsersOptionsTradeRequestAction
  | AddUsersOptionsTradeSuccessAction
  | UpdateUsersOptionsTradeRequestAction
  | UpdateUsersOptionsTradeSuccessAction
  | UsersFailureAction;
