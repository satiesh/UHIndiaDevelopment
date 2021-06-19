/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import {  channel } from '@app/models';



export enum ActionTypes {
  GET_CHANNEL_REQUEST = '[Channel Data] Get Channel Request',
  GET_CHANNEL_FAILURE = '[Channel Data] Get Channel Failure',
  GET_CHANNEL_SUCCESS = '[Channel Data] Get Channel Success',

  UPDATE_CHANNEL_REQUEST = '[Channel Data] Update Channel Request',
  UPDATE_CHANNEL_SUCCESS = '[Channel Data] Update Channel Success',
  ADD_CHANNEL_REQUEST = '[Channel Data] Add Channel Request',
  ADD_CHANNEL_SUCCESS = '[Channel Data] Add Channel Success',
  DELETE_CHANNEL_REQUEST = '[Channel Data] Delete Channel Request',
  DELETE_CHANNEL_SUCCESS = '[Channel Data] Delete Channel Success'

}

export class ChannelRequestAction implements Action {
  readonly type = ActionTypes.GET_CHANNEL_REQUEST;
}

export class ChannelFailureAction implements Action {
  readonly type = ActionTypes.GET_CHANNEL_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class ChannelSuccessAction implements Action {
  readonly type = ActionTypes.GET_CHANNEL_SUCCESS;
  constructor(public payload: { channelData: channel[] }) { }
}

export class AddChannelRequestAction implements Action {
  readonly type = ActionTypes.ADD_CHANNEL_REQUEST;
  constructor(public payload: channel) { }
}

export class AddChannelSuccessAction implements Action {
  readonly type = ActionTypes.ADD_CHANNEL_SUCCESS;
  constructor(public payload: channel) { }
}

export class UpdateChannelRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_CHANNEL_REQUEST;
  constructor(public payload: channel) { }
}

export class UpdateChannelSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_CHANNEL_SUCCESS;
  constructor(public payload: channel) { }
}

export class DeleteChannelRequestAction implements Action {
  readonly type = ActionTypes.DELETE_CHANNEL_REQUEST;
  constructor(public payload: channel) { }
}

export class DeleteChannelSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_CHANNEL_SUCCESS;
  constructor(public payload: channel) { }
}

export type Actions =
  | ChannelRequestAction
  | ChannelFailureAction
  | ChannelSuccessAction
  | AddChannelRequestAction
  | AddChannelSuccessAction
  | DeleteChannelRequestAction
  | DeleteChannelSuccessAction
  | UpdateChannelRequestAction
  | UpdateChannelSuccessAction;
