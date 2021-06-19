/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './useroptiontrade-data.action';
import { State, initialState, adapter } from './useroptiontrade-data.state';


export function useroptiontradeDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_USERS_OPTIONSTRADE_REQUEST:
    case ActionTypes.ADD_USERS_OPTIONSTRADE_REQUEST:
    case ActionTypes.UPDATE_USERS_OPTIONSTRADE_REQUEST:
      return {
        ...state,
        isUserOptionTradeLoading: true
      };

    case ActionTypes.GET_USERS_OPTIONSTRADE_SUCCESS:
      return adapter.addAll(action.payload.useroptiontrades, {
        ...state,
        isUserOptionTradeLoading: false,
        isUserOptionTradeLoaded: true
      });


    case ActionTypes.ADD_USERS_OPTIONSTRADE_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isUserOptionTradeLoading: false,
          isUserOptionTradeLoaded: true
        });

    case ActionTypes.UPDATE_USERS_OPTIONSTRADE_SUCCESS:
      return adapter.removeOne(action.payload.id, {
        ...state,
        isUserLoading: false,
        isUserLoaded: true
      });


    case ActionTypes.USERS_FAILURE:
      return {
        ...state,
        isUserOptionTradeLoading: false,
        isUserOptionTradeLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}



export const useroptiontradeEntitySelectors = adapter.getSelectors();
