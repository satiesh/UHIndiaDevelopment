/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './permission-data.action';
import { State, initialState, adapter } from './permission-data.state';


export function permissionsDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_PERMISSIONS_REQUEST:
      return {
        ...state,
        isPermissionsLoading: true,
        isPermissionsLoaded: false,
        error: null
      };

    case ActionTypes.GET_PERMISSIONS_SUCCESS:
      return adapter.addAll(action.payload.permissionsData, {
        ...state,
        isPermissionsLoading: false,
        isPermissionsLoaded: true
      });

    case ActionTypes.GET_PERMISSIONS_FAILURE:
      return {
        ...state,
        isPermissionsLoading: false,
        isPermissionsLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const permissionEntitySelectors = adapter.getSelectors();
