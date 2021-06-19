/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { coupons } from '@app/models/coupons';
import { useroptiontrades } from '../../models/useroptiontrade';



export enum ActionTypes {
  GET_COUPON_REQUEST = '[Coupon Data] Get Coupon Request',
  GET_COUPON_SUCCESS = '[Coupon Data] Get Coupon Success',
  ADD_COUPON_REQUEST = '[Coupon Data] Add Coupon Request',
  ADD_COUPON_SUCCESS = '[Coupon Data] Add Coupon Success',
  UPDATE_COUPON_REQUEST = '[Coupon Data] Update Coupon  Request',
  UPDATE_COUPON_SUCCESS = '[Coupon Data] Update Coupon Success',
  DELETE_COUPON_REQUEST = '[Coupon Data] Delete Coupon Request',
  DELETE_COUPON_SUCCESS = '[Coupon Data] Delete Coupon Success',
  COUPON_FAILURE = '[Coupon Data] Get Coupon Failure'

}

export class CouponRequestAction implements Action {
  readonly type = ActionTypes.GET_COUPON_REQUEST;
}
export class CouponSuccessAction implements Action {
  readonly type = ActionTypes.GET_COUPON_SUCCESS;
  constructor(public payload: { couponsData: coupons[] }) { }
}

//export class CouponOptionsTradeRequestAction implements Action {
//  readonly type = ActionTypes.GET_COUPON_OPTIONSTRADE_REQUEST;
//}
//export class CouponOptionsTradeSuccessAction implements Action {
//  readonly type = ActionTypes.GET_COUPON_OPTIONSTRADE_SUCCESS;
//  constructor(public payload: { useroptiontrades: useroptiontrades[] }) { }
//}

export class AddCouponRequestAction implements Action {
  readonly type = ActionTypes.ADD_COUPON_REQUEST;
  constructor(public payload: coupons) { }
}
export class AddCouponSuccessAction implements Action {
  readonly type = ActionTypes.ADD_COUPON_SUCCESS;
  constructor(public payload: coupons) { }
}

export class UpdateCouponRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_COUPON_REQUEST;
  constructor(public payload: coupons) { }
}
export class UpdateCouponSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_COUPON_SUCCESS;
  constructor(public payload: coupons) { }
}

export class DeleteCouponRequestAction implements Action {
  readonly type = ActionTypes.DELETE_COUPON_REQUEST;
  constructor(public payload: coupons) { }
}
export class DeleteCouponSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_COUPON_SUCCESS;
  constructor(public payload: coupons) { }
}

export class CouponFailureAction implements Action {
  readonly type = ActionTypes.COUPON_FAILURE;
  constructor(public payload: { error: string }) { }
}



export type Actions =
  | CouponRequestAction
  | CouponSuccessAction
  | AddCouponRequestAction
  | AddCouponSuccessAction
  | DeleteCouponRequestAction
  | DeleteCouponSuccessAction
  | CouponFailureAction
  | UpdateCouponRequestAction
  | UpdateCouponSuccessAction;
