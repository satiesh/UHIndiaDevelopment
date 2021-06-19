/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './dailytrade-data.action';
import { State, initialState, adapter } from './dailytrade-data.state';


export function dailytradeDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_DAILYTICKER_REQUEST:
    case ActionTypes.UPDATE_DAILYTICKER_REQUEST:
    case ActionTypes.ADD_DAILYTICKER_REQUEST:
    case ActionTypes.DELETE_DAILYTICKER_REQUEST:
      return {
        ...state,
        isDailyTradeLoading: true
      };

    case ActionTypes.GET_DAILYTICKER_SUCCESS:
      return adapter.addAll(action.payload.dailytickerData, {
        ...state,
        isDailyTradeLoading: false,
        isDailyTradeLoaded: true
      });

    case ActionTypes.ADD_DAILYTICKER_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isDailyTradeLoading: false,
          isDailyTradeLoaded: true
        });

    case ActionTypes.DELETE_DAILYTICKER_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isDailyTradeLoading: false,
          isDailyTradeLoaded: true
        }
      );
  }
      //return adapter.removeOne(action.payload.id, {
      //  ...state,
      //  issubscriptionDataLoading: false,
      //  issubscriptionDataLoaded: true
      //});

    case ActionTypes.UPDATE_DAILYTICKER_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isDailyTradeLoading: false,
          isDailyTradeLoaded: true
        }
      );
    }

    case ActionTypes.GET_DAILYTICKER_FAILURE:
      return {
        ...state,
        isDailyTradeLoading: false,
        isDailyTradeLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const dailyTradeEntitySelectors = adapter.getSelectors();
