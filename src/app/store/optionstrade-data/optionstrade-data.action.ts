/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Action } from '@ngrx/store'
import { channeldisplay, optionstrade } from '@app/models';
import { optionstradenotes } from '../../models/optionstradenotes';


export enum ActionTypes {
  GET_OPTIONSTRADE_REQUEST = '[OptionsTrade Data] Get OptionsTrade Request',
  GET_OPTIONSTRADE_FAILURE = '[OptionsTrade Data] Get OptionsTrade Failure',
  GET_OPTIONSTRADE_SUCCESS = '[OptionsTrade Data] Get OptionsTrade Success',

  GET_DAILYSTOCKTRADE_REQUEST = '[OptionsTrade Data] Get DailyStockTrade Request',
  GET_DAILYSTOCKTRADE_FAILURE = '[OptionsTrade Data] Get DailyStockTrade Failure',
  GET_DAILYSTOCKTRADE_SUCCESS = '[OptionsTrade Data] Get DailyStockTrade Success',


  UPDATE_OPTIONSTRADE_REQUEST = '[OptionsTrade Data] Update OptionsTrade Request',
  UPDATE_OPTIONSTRADE_SUCCESS = '[OptionsTrade Data] Update OptionsTrade Success',
  UPDATE_OPTIONSTRADE_NOTES_REQUEST = '[OptionsTrade Data] Update OptionsTrade Notes Request',
  UPDATE_OPTIONSTRADE_NOTES_SUCCESS = '[OptionsTrade Data] Update OptionsTrade Notes Success',

  ADD_OPTIONSTRADE_REQUEST = '[OptionsTrade Data] Add OptionsTrade Request',
  ADD_OPTIONSTRADE_SUCCESS = '[OptionsTrade Data] Add OptionsTrade Success',
  DELETE_OPTIONSTRADE_REQUEST = '[OptionsTrade Data] Delete OptionsTrade Request',
  DELETE_OPTIONSTRADE_SUCCESS = '[OptionsTrade Data] Delete OptionsTrade Success'

}

export class OptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.GET_OPTIONSTRADE_REQUEST;
}

export class OptionsTradeFailureAction implements Action {
  readonly type = ActionTypes.GET_OPTIONSTRADE_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class OptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.GET_OPTIONSTRADE_SUCCESS;
  constructor(public payload: { optionstradeData: optionstrade[] }) { }
}

export class DailyStockTradeRequestAction implements Action {
  readonly type = ActionTypes.GET_DAILYSTOCKTRADE_REQUEST;
}

export class DailyStockTradeFailureAction implements Action {
  readonly type = ActionTypes.GET_DAILYSTOCKTRADE_FAILURE;
  constructor(public payload: { error: string }) { }
}

export class DailyStockTradeSuccessAction implements Action {
  readonly type = ActionTypes.GET_DAILYSTOCKTRADE_SUCCESS;
  constructor(public payload: { optionstradeData: optionstrade[] }) { }
}


export class AddOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.ADD_OPTIONSTRADE_REQUEST;
  constructor(public payload: { optionstrade: optionstrade}) { }
}

export class AddOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.ADD_OPTIONSTRADE_SUCCESS;
  constructor(public payload: optionstrade) { }
}

export class UpdateOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_OPTIONSTRADE_REQUEST;
  constructor(public payload: { optionstrade: optionstrade}) { }
}

export class UpdateOptionsTradeNoteRequestAction implements Action {
  readonly type = ActionTypes.UPDATE_OPTIONSTRADE_NOTES_REQUEST;
  constructor(public payload: { optionstrade: optionstrade, notes: optionstradenotes[], stocknotes: optionstradenotes[]}) { }
}

export class UpdateOptionsTradeNoteSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_OPTIONSTRADE_NOTES_SUCCESS;
  constructor(public payload: optionstrade) { }
}


export class UpdateOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_OPTIONSTRADE_SUCCESS;
  constructor(public payload: optionstrade) { }
}

export class DeleteOptionsTradeRequestAction implements Action {
  readonly type = ActionTypes.DELETE_OPTIONSTRADE_REQUEST;
  constructor(public payload: optionstrade) { }
}

export class DeleteOptionsTradeSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_OPTIONSTRADE_SUCCESS;
  constructor(public payload: optionstrade) { }
}

export type Actions =
  | OptionsTradeRequestAction
  | OptionsTradeFailureAction
  | OptionsTradeSuccessAction
  | DailyStockTradeRequestAction
  | DailyStockTradeSuccessAction
  | DailyStockTradeFailureAction
  | AddOptionsTradeRequestAction
  | AddOptionsTradeSuccessAction
  | DeleteOptionsTradeRequestAction
  | DeleteOptionsTradeSuccessAction
  | UpdateOptionsTradeRequestAction
  | UpdateOptionsTradeSuccessAction
  | UpdateOptionsTradeNoteRequestAction
  | UpdateOptionsTradeNoteSuccessAction;

