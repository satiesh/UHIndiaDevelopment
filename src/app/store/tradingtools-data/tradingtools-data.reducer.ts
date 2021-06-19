/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './tradingtools-data.action';
import { State, initialState, adapter } from './tradingtools-data.state';


export function tradingtoolDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_TRADINGTOOLS_REQUEST:
      return {
        ...state,
        isTradingToolsLoading: true
      };

    case ActionTypes.GET_TRADINGTOOLS_SUCCESS:
      return adapter.addAll(action.payload.tradingtoolsData, {
        ...state,
        isTradingToolsLoading: false,
        isTradingToolsLoaded: true
      });

    case ActionTypes.GET_TRADINGTOOLS_FAILURE:
      return {
        ...state,
        isTradingToolsLoading: false,
        isTradingToolsLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const tradingToolsEntitySelectors = adapter.getSelectors();
