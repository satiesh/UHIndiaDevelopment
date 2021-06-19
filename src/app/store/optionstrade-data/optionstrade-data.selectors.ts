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

import { State, adapter } from './optionstrade-data.state';
import { dailyTradeEntitySelectors } from './optionstrade-data.reducer';
import { optionstrade } from '../../models';
import { Utilities } from '../../services';


export const getError = (state: State): any => state.error;
export const getOptionsTradeLoading = (state: State): boolean => state.isOptionsTradeLoading;
export const getOptionsTradeLoaded = (state: State): boolean => state.isOptionsTradeLoaded;

export const selectOptionsTradeState: MemoizedSelector<object, State> = createFeatureSelector<State>('optionstradeData');

export const selectOptionsTradesLoading: MemoizedSelector<object, boolean> = createSelector(selectOptionsTradeState, getOptionsTradeLoading);
export const selectOptionsTradesLoaded: MemoizedSelector<object, boolean> = createSelector(selectOptionsTradeState, getOptionsTradeLoaded);
export const selectOptionsTrades: (state: object) => optionstrade[] = adapter.getSelectors(selectOptionsTradeState).selectAll;

export const selectOptionsTradesByGroup = (groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        //return allOptionsTrades.filter(p => p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS');
        return allOptionsTrades;
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS');
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => p.postedFor == groupName);
      }
    } else {
      return null;
    }
  });

export const selectOptionsTradeById = (id: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      return allOptionsTrades.find(p => p.id == id);
    } else {
      return null;
    }
  });



export const selectOptionsTradeByTodaysDate = (groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        return allOptionsTrades.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY")
          //&& (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS')
        );
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY")
          && (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS'));
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY") && p.postedFor == groupName);
      }

    } else {
      return null;
    }
  });

export const selectAllTradeByDate = (fromdate: Date, todate: Date, groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          //&& (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS')
        );
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS'));
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.postedFor == groupName);
      }
    } else {
      return null;
    }
  });

export const selectOptionsTradeByDate = (fromdate: Date, todate: Date, groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.trans.length > 0 && (p.isoptionactive == true || p.isoptionactive == null)
          //&& (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS')
        );
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.trans.length > 0 && (p.isoptionactive == true || p.isoptionactive == null)
          && (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS'));
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate && p.trans.length > 0
          && (p.isoptionactive == true || p.isoptionactive == null) && p.postedFor == groupName);
      }
    } else {
      return null;
    }
  });

export const selectClosedOptionsTradeByDate = (fromdate: Date, todate: Date, groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.trans.length > 0
          && (p.isoptionactive == false && p.isstockactive == false)
          //&& (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS')
        );
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.trans.length > 0
          && (p.isoptionactive == false && p.isstockactive == false)
          && (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS')
        );
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.trans.length > 0
          && (p.isoptionactive == false && p.isstockactive == false)
          && p.postedFor == groupName
        );
      }
    } else {
      return null;
    }
  });

export const selectStockOfTheDayByDate = () =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      return allOptionsTrades.filter(p =>
        moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY")
        && p.currentStockPrice.length > 0
        && (p.isstockactive == true)
        && (p.stockoftheday == true)
      );
    }
  });

export const selectStockTradeByDate = (fromdate: Date, todate: Date, groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate
          && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.currentStockPrice.length > 0
          && (p.isstockactive == true)
          //&& (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS')
        );
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate
          && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.currentStockPrice.length > 0
          && (p.isstockactive == true)
          && (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS'));
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate
          && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.currentStockPrice.length > 0
          && (p.isstockactive == true)
          && p.postedFor == groupName);
      }
      } else {
      return null;
    }
  });

export const selectClosedStockTradeByDate = (fromdate: Date, todate: Date, groupName: string) =>
  createSelector(selectOptionsTrades, (allOptionsTrades: optionstrade[]) => {
    if (allOptionsTrades) {
      if (groupName == 'PLATINUM MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate
          && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.currentStockPrice.length > 0
          && (p.isstockactive == false && p.isstockactive != null)
          //&& (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS' || p.postedFor == 'GOLD MEMBERS')
        );
      }
      else if (groupName == 'GOLD MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate
          && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.currentStockPrice.length > 0
          && (p.isstockactive == false && p.isstockactive != null) && (p.postedFor == groupName || p.postedFor == 'SILVER MEMBERS'));
      }
      else if (groupName == 'SILVER MEMBERS') {
        return allOptionsTrades.filter(p => Utilities.transformSecondsToDate(p.createdon) >= fromdate
          && Utilities.transformSecondsToDate(p.createdon) <= todate
          && p.currentStockPrice.length > 0
          && (p.isstockactive == false && p.isstockactive != null) && p.postedFor == groupName);
      }
      } else {
      return null;
    }
  });


export const selectError: MemoizedSelector<object, any> = createSelector(selectOptionsTradeState, getError);

