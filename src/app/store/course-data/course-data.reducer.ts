/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Actions, ActionTypes } from './course-data.action';
import { State, initialState, adapter } from './course-data.state';


export function coursesDataReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.GET_COURSES_REQUEST:
    case ActionTypes.ADD_COURSES_REQUEST:
    case ActionTypes.UPDATE_COURSES_REQUEST:
    case ActionTypes.DELETE_COURSES_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case ActionTypes.GET_COURSES_SUCCESS:
      return adapter.addAll(action.payload.coursesData, {
        ...state,
        isLoading: false,
        isCourseLoaded: true
      });

    case ActionTypes.ADD_COURSES_SUCCESS:
      return adapter.addOne(action.payload,
        {
          ...state,
          isLoading: false,
          isCourseLoaded: true
        });

    case ActionTypes.DELETE_COURSES_SUCCESS:
      return adapter.removeOne(action.payload.id, {
        ...state,
        isLoading: false,
        isCourseLoaded: true
      });

    case ActionTypes.UPDATE_COURSES_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: action.payload
        },
        {
          ...state,
          isLoading: false,
          isCourseLoaded: true
        }
      );
    }
    case ActionTypes.COURSES_FAILURE:
      return {
        ...state,
        isLoading: false,
        isCourseLoaded: false,
        error: action.payload.error
      };
    default: {
      return state;
    }
  }
}

export const courseEntitySelectors = adapter.getSelectors();
