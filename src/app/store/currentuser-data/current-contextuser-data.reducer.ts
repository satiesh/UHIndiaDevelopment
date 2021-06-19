/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './current-contextuser-data.action';
import { State, initialState, adapter } from './current-contextuser-data.state';


export function currentUsersDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_CURRENT_USER_REQUEST:
    case ActionTypes.UPDATE_CURRENT_USER_REQUEST:
    case ActionTypes.UPDATE_USER_NOTIFICATION_REQUEST:
    case ActionTypes.UPDATE_USER_SUBSCRIPTION_REQUEST:
    case ActionTypes.UPDATE_USER_PROFILE_REQUEST:
    case ActionTypes.UPDATE_USER_OTHERVALUES_REQUEST:
    case ActionTypes.UPDATE_USER_DISCLAIMER_REQUEST:
      return {
        ...state,
        isCurrentUserLoading: true
      };

    case ActionTypes.GET_CURRENT_USER_SUCCESS:
      return adapter.addAll(action.payload, {
        ...state,
        isCurrentUserLoading: false,
        isCurrentUserLoaded: true
      });

    //case ActionTypes.GET_CURRENT_USER_SUCCESS:
    //  return adapter.addOne(
    //    action.payload,
    //    {
    //      ...state,
    //      isCurrentUserLoading: false,
    //      isCurrentUserLoaded: true
    //    });


    case ActionTypes.UPDATE_CURRENT_USER_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isCurrentUserLoading: false,
          isCurrentUserLoaded: true
        }
      );
    }
    case ActionTypes.UPDATE_USER_NOTIFICATION_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isCurrentUserLoading: false,
          isCurrentUserLoaded: true
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
          isCurrentUserLoading: false,
          isCurrentUserLoaded: true
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
          isCurrentUserLoading: false,
          isCurrentUserLoaded: true
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
          isCurrentUserLoading: false,
          isCurrentUserLoaded: true
        }
      );
    }
    case ActionTypes.UPDATE_USER_DISCLAIMER_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.uid,
          changes: action.payload
        },
        {
          ...state,
          isCurrentUserLoading: false,
          isCurrentUserLoaded: true
        }
      );
    }
    case ActionTypes.USERS_FAILURE:
      return {
        ...state,
        isCurrentUserLoading: false,
        isCurrentUserLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const currentUserEntitySelectors = adapter.getSelectors();
