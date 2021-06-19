/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import { State } from './tradingtools-data.state';
import { tradingToolsEntitySelectors } from './tradingtools-data.reducer';


export const getTradingToolsStore = createFeatureSelector('tradingtoolsData');

export const getTradingToolsEntities = createSelector(
  getTradingToolsStore,
  tradingToolsEntitySelectors.selectAll
);

export const getTradingTools = createSelector(getTradingToolsEntities, entities => {
  return Object.values(entities);
});

export const getTradingToolsLoaded = createSelector(
  getTradingToolsStore, (tradingToolsStore: State) => tradingToolsStore.isTradingToolsLoaded);

export const getTradingToolsLoading = createSelector(
  getTradingToolsStore,
  (tradingToolsStore: State) => tradingToolsStore.isTradingToolsLoading);

export const getTradingToolsError = createSelector(
  getTradingToolsStore,
  (tradingToolsStore: State) => tradingToolsStore.error);

