/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import { AppService } from '@app/services/app-service';
import * as featureActions from './course-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';


@Injectable()
export class CoursesDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CourseRequestAction>(
      featureActions.ActionTypes.GET_COURSES_REQUEST
    ),
    switchMap(action =>
      this.appService.getcourses()
        .pipe(
          take(1),
          map(
            coursesData => new featureActions.CourseSuccessAction({
               coursesData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.CourseFailureAction({ error })))
        )
    )
  );

  @Effect()
  addCourseEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddCourseRequestAction>(featureActions.ActionTypes.ADD_COURSES_REQUEST),
    switchMap(action =>
      this.appService.addCourse(action.payload)
        .pipe(
          take(1),
          map(returnData => new featureActions.AddCourseSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CourseFailureAction({ error })))
        )
    ),

  );

  @Effect()
  updateCourseEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateCourseRequestAction>(featureActions.ActionTypes.UPDATE_COURSES_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateCourse(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateCourseSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.CourseFailureAction({ error })))
        )
    }),

  );

}
