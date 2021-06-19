/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './template-data.action';
import { State, initialState, adapter } from './template-data.state';


export function templateDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_TEMPLATE_REQUEST:
    case ActionTypes.UPDATE_TEMPLATE_REQUEST:
    case ActionTypes.ADD_TEMPLATE_REQUEST:
    case ActionTypes.DELETE_TEMPLATE_REQUEST:
      return {
        ...state,
        isTemplateLoading: true
      };

    case ActionTypes.GET_TEMPLATE_SUCCESS:
      return adapter.addAll(action.payload.templateData, {
        ...state,
        isTemplateLoading: false,
        isTemplateLoaded: true
      });

    case ActionTypes.ADD_TEMPLATE_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isTemplateLoading: false,
          isTemplateLoaded: true
        });

    case ActionTypes.DELETE_TEMPLATE_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isTemplateLoading: false,
          isTemplateLoaded: true
        }
      );
    }
   
    case ActionTypes.UPDATE_TEMPLATE_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isTemplateLoading: false,
          isTemplateLoaded: true
        }
      );
    }

    case ActionTypes.GET_TEMPLATE_FAILURE:
      return {
        ...state,
        isTemplateLoading: false,
        isTemplateLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const templateEntitySelectors = adapter.getSelectors();
