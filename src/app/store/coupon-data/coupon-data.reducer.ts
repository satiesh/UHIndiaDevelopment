/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './coupon-data.action';
import { State, initialState, adapter } from './coupon-data.state';


export function couponsDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_COUPON_REQUEST:
    case ActionTypes.ADD_COUPON_REQUEST:
    case ActionTypes.DELETE_COUPON_REQUEST:
    case ActionTypes.UPDATE_COUPON_REQUEST:
      return {
        ...state,
        isCouponLoading: true
      };

    case ActionTypes.GET_COUPON_SUCCESS:
      return adapter.addAll(action.payload.couponsData, {
        ...state,
        isCouponLoading: false,
        isCouponLoaded: true
      });


    case ActionTypes.ADD_COUPON_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isCouponLoading: false,
          isCouponLoaded: true
        });

    case ActionTypes.DELETE_COUPON_SUCCESS:
      return adapter.removeOne(action.payload.id, {
        ...state,
        isCouponLoading: false,
        isCouponLoaded: true
      });
    case ActionTypes.UPDATE_COUPON_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isCouponLoading: false,
          isCouponLoaded: true
        }
      );
    }
    case ActionTypes.COUPON_FAILURE:
      return {
        ...state,
        isCouponLoading: false,
        isCouponLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}



export const couponEntitySelectors = adapter.getSelectors();
