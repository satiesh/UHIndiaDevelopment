/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { tradingtools} from '@app/models';



export enum ActionTypes {
  GET_TRADINGTOOLS_REQUEST = '[TradingTools Data] Get TradingTools Request',
  GET_TRADINGTOOLS_FAILURE = '[TradingTools Data] Get TradingTools Failure',
  GET_TRADINGTOOLS_SUCCESS = '[TradingTools Data] Get TradingTools Success'
}

export class ToolsTradingRequestAction implements Action {
  readonly type = ActionTypes.GET_TRADINGTOOLS_REQUEST;
}

export class ToolsTradingFailureAction implements Action {
  readonly type = ActionTypes.GET_TRADINGTOOLS_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class ToolsTradingSuccessAction implements Action {
  readonly type = ActionTypes.GET_TRADINGTOOLS_SUCCESS;
  constructor(public payload: { tradingtoolsData: tradingtools[] }) { }
}

export type Actions = ToolsTradingRequestAction | ToolsTradingFailureAction | ToolsTradingSuccessAction;
