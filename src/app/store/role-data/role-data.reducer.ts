/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './role-data.action';
import { State, initialState, adapter } from './role-data.state';


export function rolesDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_ROLES_REQUEST:
    case ActionTypes.ADD_ROLES_REQUEST:
    case ActionTypes.UPDATE_ROLES_REQUEST:
    case ActionTypes.DELETE_ROLES_REQUEST:
      return {
        ...state,
        isRolesLoading: true,
      };



    case ActionTypes.GET_ROLES_SUCCESS:
      return adapter.addAll(action.payload.rolesData, {
        ...state,
        isRolesLoading: false,
        isRolesLoaded: true
      });


    case ActionTypes.ADD_ROLES_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isRolesLoading: false,
          isRolesLoaded: true
        });

    case ActionTypes.DELETE_ROLES_SUCCESS:
      return adapter.removeOne(action.payload.id, {
        ...state,
        isRolesLoading: false,
        isRolesLoaded: true
      });

    case ActionTypes.UPDATE_ROLES_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isRolesLoading: false,
          isRolesLoaded: true
        }
      );
    }

    case ActionTypes.ROLES_ACTION_FAILURE:
      return {
        ...state,
        isRolesLoading: false,
        isRolesLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const roleEntitySelectors = adapter.getSelectors();
