/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { dailyticker, channeldisplay } from '@app/models';
import { broadcastinfo } from '../../models/broadcastinfo';



export enum ActionTypes {
  GET_DAILYTICKER_REQUEST = '[DailyTicker Data] Get DailyTicker Request',
  GET_DAILYTICKER_FAILURE = '[DailyTicker Data] Get DailyTicker Failure',
  GET_DAILYTICKER_SUCCESS = '[DailyTicker Data] Get DailyTicker Success',

  UPDATE_DAILYTICKER_REQUEST = '[DailyTicker Data] Update DailyTicker Request',
  UPDATE_DAILYTICKER_SUCCESS = '[DailyTicker Data] Update DailyTicker Success',
  ADD_DAILYTICKER_REQUEST = '[DailyTicker Data] Add DailyTicker Request',
  ADD_DAILYTICKER_SUCCESS = '[DailyTicker Data] Add DailyTicker Success',
  DELETE_DAILYTICKER_REQUEST = '[DailyTicker Data] Delete DailyTicker Request',
  DELETE_DAILYTICKER_SUCCESS = '[DailyTicker Data] Delete DailyTicker Success'

}

export class DailyTickerRequestAction implements Action {
  readonly type = ActionTypes.GET_DAILYTICKER_REQUEST;
}

export class DailyTickerFailureAction implements Action {
  readonly type = ActionTypes.GET_DAILYTICKER_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class DailyTickerSuccessAction implements Action {
  readonly type = ActionTypes.GET_DAILYTICKER_SUCCESS;
  constructor(public payload: { dailytickerData: dailyticker[] }) { }
}

export class AddDailyTickerRequestAction implements Action {
  readonly type = ActionTypes.ADD_DAILYTICKER_REQUEST;
  constructor(public payload: { dailyticker: dailyticker, channeldisplay: broadcastinfo }) { }
}

export class AddDailyTickerSuccessAction implements Action {
  readonly type = ActionTypes.ADD_DAILYTICKER_SUCCESS;
  constructor(public payload: dailyticker) { }
}

export class UpdateDailyTickerRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_DAILYTICKER_REQUEST;
  constructor(public payload: { dailyticker: dailyticker, channeldisplay: broadcastinfo }) { }
}

export class UpdateDailyTickerSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_DAILYTICKER_SUCCESS;
  constructor(public payload: dailyticker) { }
}

export class DeleteDailyTickerRequestAction implements Action {
  readonly type = ActionTypes.DELETE_DAILYTICKER_REQUEST;
  constructor(public payload: dailyticker) { }
}

export class DeleteDailyTickerSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_DAILYTICKER_SUCCESS;
  constructor(public payload: dailyticker) { }
}

export type Actions =
  | DailyTickerRequestAction
  | DailyTickerFailureAction
  | DailyTickerSuccessAction
  | AddDailyTickerRequestAction
  | AddDailyTickerSuccessAction
  | DeleteDailyTickerRequestAction
  | DeleteDailyTickerSuccessAction
  | UpdateDailyTickerRequestAction
  | UpdateDailyTickerSuccessAction;
