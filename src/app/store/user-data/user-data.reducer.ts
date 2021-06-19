/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './user-data.action';
import { State, initialState, adapter } from './user-data.state';


export function usersDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_USERS_REQUEST:

    case ActionTypes.ADD_USERS_REQUEST:
    case ActionTypes.GET_USERS_OPTIONSTRADE_REQUEST:
    case ActionTypes.UPDATE_USER_PROFILE_REQUEST:
    case ActionTypes.UPDATE_USER_ROLE_REQUEST:
    case ActionTypes.UPDATE_USER_SUBSCRIPTION_REQUEST:
    case ActionTypes.DELETE_USERS_REQUEST:
    case ActionTypes.DISABLE_USERS_REQUEST:
    case ActionTypes.UPDATE_USER_OTHERVALUES_REQUEST:
      return {
        ...state,
        isUserLoading: true
      };

    case ActionTypes.GET_USERS_SUCCESS:
      return adapter.addAll(action.payload.usersData, {
        ...state,
        isUserLoading: false,
        isUserLoaded: true
      });


    case ActionTypes.ADD_USERS_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        });

    case ActionTypes.DELETE_USERS_SUCCESS:
      return adapter.removeOne(action.payload.uid, {
        ...state,
        isUserLoading: false,
        isUserLoaded: true
      });

    case ActionTypes.DISABLE_USERS_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        }
      );
    }

    case ActionTypes.UPDATE_USER_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        }
      );
    }
    case ActionTypes.UPDATE_USER_PROFILE_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        }
      );
    }
    case ActionTypes.UPDATE_USER_SUBSCRIPTION_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        }
      );
    }
    case ActionTypes.UPDATE_USER_ROLE_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        }
      );
    }
    case ActionTypes.UPDATE_USER_OTHERVALUES_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isUserLoading: false,
          isUserLoaded: true
        }
      );
    }
    case ActionTypes.USERS_FAILURE:
      return {
        ...state,
        isUserLoading: false,
        isUserLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}



export const userEntitySelectors = adapter.getSelectors();
