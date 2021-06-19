/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './optionstrade-data.action';
import { State, initialState, adapter } from './optionstrade-data.state';


export function optionstradeDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_OPTIONSTRADE_REQUEST:
    case ActionTypes.GET_DAILYSTOCKTRADE_REQUEST:
    case ActionTypes.UPDATE_OPTIONSTRADE_REQUEST:
    case ActionTypes.ADD_OPTIONSTRADE_REQUEST:
    case ActionTypes.DELETE_OPTIONSTRADE_REQUEST:
      return {
        ...state,
        isOptionsTradeLoading: true
      };

    case ActionTypes.GET_OPTIONSTRADE_SUCCESS:
      return adapter.addAll(action.payload.optionstradeData, {
        ...state,
        isOptionsTradeLoading: false,
        isOptionsTradeLoaded: true
      });
    case ActionTypes.GET_DAILYSTOCKTRADE_SUCCESS:
      return adapter.addAll(action.payload.optionstradeData, {
        ...state,
        isOptionsTradeLoading: false,
        isOptionsTradeLoaded: true
      });
    case ActionTypes.ADD_OPTIONSTRADE_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isOptionsTradeLoading: false,
          isOptionsTradeLoaded: true
        });

    case ActionTypes.DELETE_OPTIONSTRADE_SUCCESS: {
      //  return adapter.updateOne(
      //    {
      //      id: action.payload.id,
      //      changes: action.payload
      //    },
      //    {
      //      ...state,
      //      isOptionsTradeLoading: false,
      //      isOptionsTradeLoaded: true
      //    }
      //  );
      //}
      return adapter.removeOne(action.payload.id, {
        ...state,
        isOptionsTradeLoading: false,
        isOptionsTradeLoaded: true
      });
    }

    case ActionTypes.UPDATE_OPTIONSTRADE_SUCCESS:
      ActionTypes.UPDATE_OPTIONSTRADE_NOTES_SUCCESS; {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isOptionsTradeLoading: false,
          isOptionsTradeLoaded: true
        }
      );
      }

    case ActionTypes.GET_OPTIONSTRADE_FAILURE:
      return {
        ...state,
        isOptionsTradeLoading: false,
        isOptionsTradeLoaded: false,
        error: action.payload.error
      };

    case ActionTypes.GET_DAILYSTOCKTRADE_FAILURE:
      return {
        ...state,
        isOptionsTradeLoading: false,
        isOptionsTradeLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const dailyTradeEntitySelectors = adapter.getSelectors();
