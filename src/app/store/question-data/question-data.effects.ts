/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './question-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class QuestionDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.QuestionRequestAction>(
      featureActions.ActionTypes.GET_QUESTION_REQUEST
    ),
    switchMap(action =>
      this.appService.getquestions()
        .pipe(
          take(1),
          map(
            questionData=> new featureActions.QuestionSuccessAction({
              questionData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.QuestionFailureAction({ error })))
        )
    )
  );


 

}
