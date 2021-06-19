/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { EntityState, EntityAdapter, createEntityAdapter,Update } from '@ngrx/entity';
import { Actions, ActionTypes } from './subscription-data.action';
import { State, initialState, adapter } from './subscription-data.state';


export function subscriptionDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.GET_SUBSCRIPTION_REQUEST:
    case ActionTypes.UPDATE_SUBSCRIPTION_REQUEST:
    case ActionTypes.ADD_SUBSCRIPTION_REQUEST:
    case ActionTypes.DELETE_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        issubscriptionDataLoading: true
      };

    case ActionTypes.GET_SUBSCRIPTION_SUCCESS:
      return adapter.addAll(action.payload.subscriptionData, {
        ...state,
        issubscriptionDataLoading: false,
        issubscriptionDataLoaded: true
      });

    case ActionTypes.ADD_SUBSCRIPTION_SUCCESS:
      return adapter.addOne(action.payload,
        {
        ...state,
        issubscriptionDataLoading: false,
        issubscriptionDataLoaded: true
      });

    case ActionTypes.DELETE_SUBSCRIPTION_SUCCESS:
      return adapter.removeOne(action.payload.id, {
        ...state,
        issubscriptionDataLoading: false,
        issubscriptionDataLoaded: true
      });

    case ActionTypes.UPDATE_SUBSCRIPTION_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          issubscriptionDataLoading: false,
          issubscriptionDataLoaded: true
        }
      );
    }

    case ActionTypes.SUBSCRIPTION_FAILURE:
      return {
        ...state,
        issubscriptionDataLoading: false,
        issubscriptionDataLoaded: false,
        error: action.payload.error
      };

    default: {
      return state;
    }
  }
}

export const subscriptionEntitySelectors = adapter.getSelectors();
