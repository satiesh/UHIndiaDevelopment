/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import {  template } from '@app/models';



export enum ActionTypes {
  GET_TEMPLATE_REQUEST = '[Template Data] Get Template Request',
  GET_TEMPLATE_FAILURE = '[Template Data] Get Template Failure',
  GET_TEMPLATE_SUCCESS = '[Template Data] Get Template Success',

  UPDATE_TEMPLATE_REQUEST = '[Template Data] Update Template Request',
  UPDATE_TEMPLATE_SUCCESS = '[Template Data] Update Template Success',
  ADD_TEMPLATE_REQUEST = '[Template Data] Add Template Request',
  ADD_TEMPLATE_SUCCESS = '[Template Data] Add Template Success',
  DELETE_TEMPLATE_REQUEST = '[Template Data] Delete Template Request',
  DELETE_TEMPLATE_SUCCESS = '[Template Data] Delete Template Success'

}

export class TemplateRequestAction implements Action {
  readonly type = ActionTypes.GET_TEMPLATE_REQUEST;
}

export class TemplateFailureAction implements Action {
  readonly type = ActionTypes.GET_TEMPLATE_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class TemplateSuccessAction implements Action {
  readonly type = ActionTypes.GET_TEMPLATE_SUCCESS;
  constructor(public payload: { templateData: template[] }) { }
}

export class AddTemplateRequestAction implements Action {
  readonly type = ActionTypes.ADD_TEMPLATE_REQUEST;
  constructor(public payload: template) { }
}

export class AddTemplateSuccessAction implements Action {
  readonly type = ActionTypes.ADD_TEMPLATE_SUCCESS;
  constructor(public payload: template) { }
}

export class UpdateTemplateRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_TEMPLATE_REQUEST;
  constructor(public payload: template) { }
}

export class UpdateTemplateSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_TEMPLATE_SUCCESS;
  constructor(public payload: template) { }
}

export class DeleteTemplateRequestAction implements Action {
  readonly type = ActionTypes.DELETE_TEMPLATE_REQUEST;
  constructor(public payload: template) { }
}

export class DeleteTemplateSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_TEMPLATE_SUCCESS;
  constructor(public payload: template) { }
}

export type Actions =
  | TemplateRequestAction
  | TemplateFailureAction
  | TemplateSuccessAction
  | AddTemplateRequestAction
  | AddTemplateSuccessAction
  | DeleteTemplateRequestAction
  | DeleteTemplateSuccessAction
  | UpdateTemplateRequestAction
  | UpdateTemplateSuccessAction;
