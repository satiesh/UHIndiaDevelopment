import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { adapter, State } from './useroptiontrade-data.state';
import { useroptiontrades } from '@app/models/useroptiontrade';

export const getError = (state: State): any => state.error;
export const getIsUserOptionTradeLoading = (state: State): boolean => state.isUserOptionTradeLoading;
export const getIsUserOptionTradeLoaded = (state: State): boolean => state.isUserOptionTradeLoaded;

export const selectUserOptionTradeState: MemoizedSelector<object, State> = createFeatureSelector<State>('useroptiontradesData');

export const selectUserOptionTradeLoading: MemoizedSelector<object, boolean> = createSelector(selectUserOptionTradeState, getIsUserOptionTradeLoading);
export const selectUserOptionTradeLoaded: MemoizedSelector<object, boolean> = createSelector(selectUserOptionTradeState, getIsUserOptionTradeLoaded);
export const selectUserOptionTrade: (state: object) => useroptiontrades[] = adapter.getSelectors(selectUserOptionTradeState).selectAll;

export const selectUserOptionTradeById = (id: string) =>
  createSelector(selectUserOptionTrade, (allTrades: useroptiontrades[]) => {
    if (allTrades) {
      return allTrades.filter(p => p.optiontradeid.trim() === id.trim());
    } else {
      return null;
    }
  });


export const selectUserTradesByType = (takeType: string) =>
  createSelector(selectUserOptionTrade, (allTrades: useroptiontrades[]) => {
    if (allTrades) {
      return allTrades.filter(p => p.takeType.trim() === takeType.trim());
    } else {
      return null;
    }
  }); 


export const selectError: MemoizedSelector<object, any> = createSelector(selectUserOptionTradeState, getError);
