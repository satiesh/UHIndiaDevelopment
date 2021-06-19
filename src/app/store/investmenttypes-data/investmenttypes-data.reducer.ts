/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './investmenttypes-data.action';
import { State, initialState, adapter } from './investmenttypes-data.state';


export function investmenttypesDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_INVESTMENTTYPES_REQUEST:
      return {
        ...state,
        isInvestmentTypesLoading: true
      };

    case ActionTypes.GET_INVESTMENTTYPES_SUCCESS:
      return adapter.addAll(action.payload.investmenttypesData, {
        ...state,
        isInvestmentTypesLoading: false,
        isInvestmentTypesLoaded: true
      });

    case ActionTypes.GET_INVESTMENTTYPES_FAILURE:
      return {
        ...state,
        isInvestmentTypesLoading: false,
        isInvestmentTypesLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const investmenttypesEntitySelectors = adapter.getSelectors();
