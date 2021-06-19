/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { questions} from '@app/models';
import { broadcastinfo } from '../../models/broadcastinfo';

export enum ActionTypes {
  GET_QUESTION_REQUEST = '[Question Data] Get Question Request',
  GET_QUESTION_FAILURE = '[Question Data] Get Question Failure',
  GET_QUESTION_SUCCESS = '[Question Data] Get Question Success',
}

export class QuestionRequestAction implements Action {
  readonly type = ActionTypes.GET_QUESTION_REQUEST;
}

export class QuestionFailureAction implements Action {
  readonly type = ActionTypes.GET_QUESTION_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class QuestionSuccessAction implements Action {
  readonly type = ActionTypes.GET_QUESTION_SUCCESS;
  constructor(public payload: { questionData: questions[] }) { }
}


export type Actions =
  | QuestionRequestAction
  | QuestionFailureAction
  | QuestionSuccessAction;
