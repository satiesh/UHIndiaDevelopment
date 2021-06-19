/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import * as moment from 'moment';

import { State, adapter } from './dailytrade-data.state';
import { dailyTradeEntitySelectors } from './dailytrade-data.reducer';
import { dailyticker } from '../../models';
import { Utilities } from '../../services';


export const getError = (state: State): any => state.error;
export const getDailyTradeLoading = (state: State): boolean => state.isDailyTradeLoading;
export const getDailyTradeLoaded = (state: State): boolean => state.isDailyTradeLoaded;

export const selectDailyTradeState: MemoizedSelector<object, State> = createFeatureSelector<State>('dailytradeData');

export const selectDailyTradesLoading: MemoizedSelector<object, boolean> = createSelector(selectDailyTradeState, getDailyTradeLoading);
export const selectDailyTradesLoaded: MemoizedSelector<object, boolean> = createSelector(selectDailyTradeState, getDailyTradeLoaded);
export const selectDailyTrades: (state: object) => dailyticker[] = adapter.getSelectors(selectDailyTradeState).selectAll;

export const selectDailyTradeByTodaysDate = () =>
  createSelector(selectDailyTrades, (allDailyTrades: dailyticker[]) => {
    if (allDailyTrades) {
      return allDailyTrades.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY") && p.isactive==true);
    } else {
      return null;
    }
  });
export const selectError: MemoizedSelector<object, any> = createSelector(selectDailyTradeState, getError);

