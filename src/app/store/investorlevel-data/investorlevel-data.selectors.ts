/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import { State } from './investorlevel-data.state';
import { investorLevelEntitySelectors } from './investorlevel-data.reducer';


export const getInvestorLevelStore = createFeatureSelector('investorlevelData');

export const getInvestorLevelEntities = createSelector(
  getInvestorLevelStore,
  investorLevelEntitySelectors.selectAll
);

export const getInvestorLevel = createSelector(getInvestorLevelEntities, entities => {
  return Object.values(entities);
});

export const getInvestorLevelLoaded = createSelector(
  getInvestorLevelStore, (investorLevelStore: State) => investorLevelStore.isInvestorLevelLoaded);

export const getInvestorLevelLoading = createSelector(
  getInvestorLevelStore,
  (investorLevelStore: State) => investorLevelStore.isInvestorLevelLoading);

export const getInvestorLevelError = createSelector(
  getInvestorLevelStore,
  (investorLevelStore: State) => investorLevelStore.error);

