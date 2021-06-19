/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './template-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class TemplateDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.TemplateRequestAction>(
      featureActions.ActionTypes.GET_TEMPLATE_REQUEST
    ),
    switchMap(action =>
      this.appService.gettemplates()
        .pipe(
          take(1),
          map(
            templateData => new featureActions.TemplateSuccessAction({
              templateData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.TemplateFailureAction({ error })))
        )
    )
  );


  @Effect()
  addTemplateEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddTemplateRequestAction>(featureActions.ActionTypes.ADD_TEMPLATE_REQUEST),
    switchMap(action => {
      const ref = this.appService.addTemplate(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(returnData => new featureActions.AddTemplateSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.TemplateFailureAction({ error })))
        )
    }),
  );

  @Effect()
  deleteTemplateEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteTemplateRequestAction>(featureActions.ActionTypes.DELETE_TEMPLATE_REQUEST),
    switchMap(action => {
      const ref = this.appService.deleteTemplate(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.DeleteTemplateSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.TemplateFailureAction({ error })))
        )
    }),

  );


  @Effect()
  updateTemplateEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateTemplateRequestAction>(featureActions.ActionTypes.UPDATE_TEMPLATE_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateTemplate(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateTemplateSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.TemplateFailureAction({ error })))
        )
    }),

  );

}
