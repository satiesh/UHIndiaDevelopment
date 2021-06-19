/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './investorlevel-data.action';
import { State, initialState, adapter } from './investorlevel-data.state';


export function investorlevelDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_INVESTORLEVEL_REQUEST:
      return {
        ...state,
        isInvestorLevelLoading: true
      };

    case ActionTypes.GET_INVESTORLEVEL_SUCCESS:
      return adapter.addAll(action.payload.investorlevelData, {
        ...state,
        isInvestorLevelLoading: false,
        isInvestorLevelLoaded: true
      });

    case ActionTypes.GET_INVESTORLEVEL_FAILURE:
      return {
        ...state,
        isInvestorLevelLoading: false,
        isInvestorLevelLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const investorLevelEntitySelectors = adapter.getSelectors();
