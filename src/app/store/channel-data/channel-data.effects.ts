/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf, from } from 'rxjs';
import * as featureActions from './channel-data.action';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AppService } from '@app/services';


@Injectable()
export class ChannelDataEffects {
  constructor(private appService: AppService, private actions$: Actions) { }

  @Effect()
  loadRequestEffects$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.ChannelRequestAction>(
      featureActions.ActionTypes.GET_CHANNEL_REQUEST
    ),
    switchMap(action =>
      this.appService.getChannel()
        .pipe(
          take(1),
          map(
            channelData => new featureActions.ChannelSuccessAction({
              channelData
            })
          ),
          catchError(error =>
            observableOf(new featureActions.ChannelFailureAction({ error })))
        )
    )
  );


  @Effect()
  addChannelEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddChannelRequestAction>(featureActions.ActionTypes.ADD_CHANNEL_REQUEST),
    switchMap(action => {
      const ref = this.appService.addChannel(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(returnData => new featureActions.AddChannelSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.ChannelFailureAction({ error })))
        )
    }),
  );

  @Effect()
  deleteChannelEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteChannelRequestAction>(featureActions.ActionTypes.DELETE_CHANNEL_REQUEST),
    switchMap(action => {
      const ref = this.appService.deleteChannel(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.DeleteChannelSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.ChannelFailureAction({ error })))
        )
    }),

  );


  @Effect()
  updateChannelEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateChannelRequestAction>(featureActions.ActionTypes.UPDATE_CHANNEL_REQUEST),
    switchMap(action => {
      const ref = this.appService.updateChannel(action.payload)
      var ObservableFrom = from(ref);
      return ObservableFrom
        .pipe(
          map(subscriptionData => new featureActions.UpdateChannelSuccessAction(action.payload)),
          catchError(error => observableOf(new featureActions.ChannelFailureAction({ error })))
        )
    }),

  );

}
