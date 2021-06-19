/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { User } from '@app/models/User';



export enum ActionTypes {
  GET_CURRENT_USER_REQUEST = '[Users Data] Get Current User Request',
  GET_CURRENT_USER_SUCCESS = '[Users Data] Get Current User Success',
  UPDATE_CURRENT_USER_REQUEST = '[Users Data] Update Current User Request',
  UPDATE_CURRENT_USER_SUCCESS = '[Users Data] Update Current User Success',
  UPDATE_USER_NOTIFICATION_REQUEST = '[Users Data] Update User Notifications Request',
  UPDATE_USER_NOTIFICATION_SUCCESS = '[Users Data] Update User Notifications Success',
  UPDATE_USER_SUBSCRIPTION_REQUEST = '[Users Data] Update User Subscription Request',
  UPDATE_USER_SUBSCRIPTION_SUCCESS = '[Users Data] Update User Subscription Success',
  UPDATE_USER_PROFILE_REQUEST = '[Users Data] Update User Profile Request',
  UPDATE_USER_PROFILE_SUCCESS = '[Users Data] Update User Profile Success',
  UPDATE_USER_OTHERVALUES_REQUEST = '[Users Data] Update User Other Values Request',
  UPDATE_USER_OTHERVALUES_SUCCESS = '[Users Data] Update User Other Values Success',
  UPDATE_USER_DISCLAIMER_REQUEST = '[Users Data] Update User disclaimer Request',
  UPDATE_USER_DISCLAIMER_SUCCESS = '[Users Data] Update User disclaimer Success',

  USERS_FAILURE = '[Users Data] Get Current User Failure'
}

export class CurrentUsersRequestAction implements Action {
  readonly type = ActionTypes.GET_CURRENT_USER_REQUEST;
  constructor(public payload: string) { }
}
export class CurrentUsersSuccessAction implements Action {
  readonly type = ActionTypes.GET_CURRENT_USER_SUCCESS;
  constructor(public payload: User[]) { }
}


export class CurrentUpdateUsersRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_CURRENT_USER_REQUEST;
  constructor(public payload: User) { }
}
export class CurrentUpdateUsersSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_CURRENT_USER_SUCCESS;
  constructor(public payload: User) { }
}

export class UpdateUsersNotificationRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_NOTIFICATION_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUsersNotificationSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_NOTIFICATION_SUCCESS;
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

export class UpdateUsersProfileRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_PROFILE_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUsersProfileSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_PROFILE_SUCCESS;
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

export class UpdateUserDisclaimerRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_DISCLAIMER_REQUEST;
  constructor(public payload: User) { }
}
export class UpdateUserDisclaimerSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_USER_DISCLAIMER_SUCCESS;
  constructor(public payload: User) { }
}


export class CurrentUsersFailureAction implements Action {
  readonly type = ActionTypes.USERS_FAILURE;
  constructor(public payload: { error: string }) { }
}



export type Actions =
  | CurrentUsersRequestAction
  | CurrentUsersSuccessAction
  | CurrentUpdateUsersRequestAction
  | CurrentUpdateUsersSuccessAction
  | CurrentUsersFailureAction
  | UpdateUsersNotificationRequestAction
  | UpdateUsersNotificationSuccessAction
  | UpdateUsersSubscriptionRequestAction
  | UpdateUsersSubscriptionSuccessAction
  | UpdateUsersProfileRequestAction
  | UpdateUsersProfileSuccessAction
  | UpdateUsersOtherValuesRequestAction
  | UpdateUsersOtherValuesSuccessAction
  | UpdateUserDisclaimerRequestAction
  | UpdateUserDisclaimerSuccessAction;

