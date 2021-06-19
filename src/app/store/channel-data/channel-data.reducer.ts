/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './channel-data.action';
import { State, initialState, adapter } from './channel-data.state';


export function channelDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_CHANNEL_REQUEST:
    case ActionTypes.UPDATE_CHANNEL_REQUEST:
    case ActionTypes.ADD_CHANNEL_REQUEST:
    case ActionTypes.DELETE_CHANNEL_REQUEST:
      return {
        ...state,
        isChannelLoading: true
      };

    case ActionTypes.GET_CHANNEL_SUCCESS:
      return adapter.addAll(action.payload.channelData, {
        ...state,
        isChannelLoading: false,
        isChannelLoaded: true
      });

    case ActionTypes.ADD_CHANNEL_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isChannelLoading: false,
          isChannelLoaded: true
        });

    case ActionTypes.DELETE_CHANNEL_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isChannelLoading: false,
          isChannelLoaded: true
        }
      );
    }
   
    case ActionTypes.UPDATE_CHANNEL_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isChannelLoading: false,
          isChannelLoaded: true
        }
      );
    }

    case ActionTypes.GET_CHANNEL_FAILURE:
      return {
        ...state,
        isChannelLoading: false,
        isChannelLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const channelEntitySelectors = adapter.getSelectors();
