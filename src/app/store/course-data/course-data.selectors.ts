/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { State, adapter } from './course-data.state';
import { Courses } from '@app/models';


export const getError = (state: State): any => state.error;
export const getCourseLoading = (state: State): boolean => state.isLoading;
export const getCourseLoaded = (state: State): boolean => state.isCourseLoaded;

export const selectCourseState: MemoizedSelector<object, State> = createFeatureSelector<State>('coursesData');

export const selectCoursesLoading: MemoizedSelector<object, boolean> = createSelector(selectCourseState, getCourseLoading);
export const selectCoursesLoaded: MemoizedSelector<object, boolean> = createSelector(selectCourseState, getCourseLoaded);
export const selectCourses: (state: object) => Courses[] = adapter.getSelectors(selectCourseState).selectAll;

export const selectCourseById = (id: string) =>
  createSelector(selectCourses, (allCourses: Courses[]) => {
    if (allCourses) {
      return allCourses.find(p => p.id.trim() === id.trim());
    } else {
      return null;
    }
  });
export const selectError: MemoizedSelector<object, any> = createSelector(selectCourseState, getError);
