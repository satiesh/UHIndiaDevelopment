/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { investorlevel } from '@app/models';



export enum ActionTypes {
  GET_INVESTORLEVEL_REQUEST = '[InvestorLevel Data] Get InvestorLevel Request',
  GET_INVESTORLEVEL_FAILURE = '[InvestorLevel Data] Get InvestorLevel Failure',
  GET_INVESTORLEVEL_SUCCESS = '[InvestorLevel Data] Get InvestorLevel Success'
}

export class InvestorLevelRequestAction implements Action {
  readonly type = ActionTypes.GET_INVESTORLEVEL_REQUEST;
}

export class InvestorLevelFailureAction implements Action {
  readonly type = ActionTypes.GET_INVESTORLEVEL_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class InvestorLevelSuccessAction implements Action {
  readonly type = ActionTypes.GET_INVESTORLEVEL_SUCCESS;
  constructor(public payload: { investorlevelData: investorlevel[] }) { }
}

export type Actions = InvestorLevelRequestAction | InvestorLevelFailureAction | InvestorLevelSuccessAction;
