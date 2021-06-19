/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { investmenttypes } from '@app/models';



export enum ActionTypes {
  GET_INVESTMENTTYPES_REQUEST = '[InvestmentTypes Data] Get InvestmentTypes Request',
  GET_INVESTMENTTYPES_FAILURE = '[InvestmentTypes Data] Get InvestmentTypes Failure',
  GET_INVESTMENTTYPES_SUCCESS = '[InvestmentTypes Data] Get InvestmentTypes Success'
}

export class InvestmentTypesRequestAction implements Action {
  readonly type = ActionTypes.GET_INVESTMENTTYPES_REQUEST;
}

export class InvestmentTypesFailureAction implements Action {
  readonly type = ActionTypes.GET_INVESTMENTTYPES_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class InvestmentTypesSuccessAction implements Action {
  readonly type = ActionTypes.GET_INVESTMENTTYPES_SUCCESS;
  constructor(public payload: { investmenttypesData: investmenttypes[] }) { }
}

export type Actions = InvestmentTypesRequestAction | InvestmentTypesFailureAction | InvestmentTypesSuccessAction;
