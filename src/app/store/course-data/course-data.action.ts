/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { Courses } from '@app/models/courses';


export enum ActionTypes {
  GET_COURSES_REQUEST = '[Course Data] Get Courses Request',
  GET_COURSES_SUCCESS = '[Course Data] Get Courses Success',
  ADD_COURSES_REQUEST = '[Course Data] Add Courses Request',
  ADD_COURSES_SUCCESS = '[Course Data] Add Courses Success',
  UPDATE_COURSES_REQUEST = '[Course Data] Update Courses Request',
  UPDATE_COURSES_SUCCESS = '[Course Data] Update Courses Success',
  DELETE_COURSES_REQUEST = '[Course Data] Delete Courses Request',
  DELETE_COURSES_SUCCESS = '[Course Data] Delete Courses Success',
  COURSES_FAILURE = '[Course Data] Courses Failure'
}

export class CourseRequestAction implements Action {
  readonly type = ActionTypes.GET_COURSES_REQUEST;
}

export class CourseSuccessAction implements Action {
  readonly type = ActionTypes.GET_COURSES_SUCCESS;
  constructor(public payload: { coursesData: Courses[] }) { }
}

export class AddCourseRequestAction implements Action {
  readonly type = ActionTypes.ADD_COURSES_REQUEST;
  constructor(public payload: Courses) { }
}

export class AddCourseSuccessAction implements Action {
  readonly type = ActionTypes.ADD_COURSES_SUCCESS;
  constructor(public payload: Courses) { }
}

export class UpdateCourseRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_COURSES_REQUEST;
  constructor(public payload: Courses) { }
}

export class UpdateCourseSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_COURSES_SUCCESS;
  constructor(public payload: Courses) { }
}

export class DeleteCourseRequestAction implements Action {
  readonly type = ActionTypes.DELETE_COURSES_REQUEST;
  constructor(public payload: Courses) { }
}

export class DeleteCourseSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_COURSES_SUCCESS;
  constructor(public payload: Courses) { }
}

export class CourseFailureAction implements Action {
  readonly type = ActionTypes.COURSES_FAILURE;
  constructor(public payload: { error: string }) { }
}

export type Actions =
  | CourseRequestAction
  | CourseSuccessAction
  | AddCourseRequestAction
  | AddCourseSuccessAction
  | UpdateCourseRequestAction
  | UpdateCourseSuccessAction
  | DeleteCourseRequestAction
  | DeleteCourseSuccessAction
  | CourseFailureAction
