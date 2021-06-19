/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { ServiceSubscription } from '@app/models';



export enum ActionTypes {
  GET_SUBSCRIPTION_REQUEST = '[Subscription Data] Get Subscription Request',
  GET_SUBSCRIPTION_SUCCESS = '[Subscription Data] Get Subscription Success',
  UPDATE_SUBSCRIPTION_REQUEST = '[Subscription Data] Update Subscription Request',
  UPDATE_SUBSCRIPTION_SUCCESS = '[Subscription Data] Update Subscription Success',
  ADD_SUBSCRIPTION_REQUEST = '[Subscription Data] Add Subscription Request',
  ADD_SUBSCRIPTION_SUCCESS = '[Subscription Data] Add Subscription Success',
  DELETE_SUBSCRIPTION_REQUEST = '[Subscription Data] Delete Subscription Request',
  DELETE_SUBSCRIPTION_SUCCESS = '[Subscription Data] Delete Subscription Success',
  GET_SUBSCRIPTION_BY_ID_REQUEST = '[Subscription Data] Get Subscription by id Request',
  Get_SUBSCRIPTION_BY_ID_SUCCESS = '[Subscription Data] Get Subscription by id Success',

  SUBSCRIPTION_FAILURE = '[Subscription Data] Subscription Failure',
 }

export class SubscriptionRequestAction implements Action {
  readonly type = ActionTypes.GET_SUBSCRIPTION_REQUEST;
}

export class SubscriptionSuccessAction implements Action {
  readonly type = ActionTypes.GET_SUBSCRIPTION_SUCCESS;
  constructor(public payload: { subscriptionData: ServiceSubscription[] }) { }
}

export class AddSubscriptionRequestAction implements Action {
  readonly type = ActionTypes.ADD_SUBSCRIPTION_REQUEST;
  constructor(public payload: ServiceSubscription) { }
}

export class AddSubscriptionSuccessAction implements Action {
  readonly type = ActionTypes.ADD_SUBSCRIPTION_SUCCESS;
  constructor(public payload: ServiceSubscription) { }
}

export class UpdateSubscriptionRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_SUBSCRIPTION_REQUEST;
  constructor(public payload: ServiceSubscription) { }
}

export class UpdateSubscriptionSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_SUBSCRIPTION_SUCCESS;
  constructor(public payload: ServiceSubscription) { }
}

export class DeleteSubscriptionRequestAction implements Action {
  readonly type = ActionTypes.DELETE_SUBSCRIPTION_REQUEST;
  constructor(public payload: ServiceSubscription) { }
}

export class DeleteSubscriptionSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_SUBSCRIPTION_SUCCESS;
  constructor(public payload: ServiceSubscription) { }
}

export class GeSubscriptionById implements Action {
  readonly type = ActionTypes.GET_SUBSCRIPTION_BY_ID_REQUEST;
  constructor(public payload: string) { }
}

export class GetHeroByIdSuccess implements Action {
  readonly type = ActionTypes.Get_SUBSCRIPTION_BY_ID_SUCCESS;
  constructor(public payload: ServiceSubscription) { }
}

export class SubscriptionFailureAction implements Action {
  readonly type = ActionTypes.SUBSCRIPTION_FAILURE;
  constructor(public payload: { error: string }) { }
}
export type Actions =
  | SubscriptionRequestAction
  | SubscriptionSuccessAction
  | AddSubscriptionRequestAction
  | AddSubscriptionSuccessAction
  | DeleteSubscriptionRequestAction
  | DeleteSubscriptionSuccessAction
  | UpdateSubscriptionRequestAction
  | UpdateSubscriptionSuccessAction
  | SubscriptionFailureAction;

