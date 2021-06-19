/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './question-data.action';
import { State, initialState, adapter } from './question-data.state';


export function questionDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_QUESTION_REQUEST:
      return {
        ...state,
        isQuestionLoading: true
      };

    case ActionTypes.GET_QUESTION_SUCCESS:
      return adapter.addAll(action.payload.questionData, {
        ...state,
        isQuestionLoading: false,
        isQuestionLoaded: true
      });
    case ActionTypes.GET_QUESTION_FAILURE:
      return {
        ...state,
        isQuestionLoading: false,
        isQuestionLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const questionEntitySelectors = adapter.getSelectors();
