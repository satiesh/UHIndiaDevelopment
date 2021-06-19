/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import { State } from './investmenttypes-data.state';
import { investmenttypesEntitySelectors } from './investmenttypes-data.reducer';


export const getInvestmentTypesStore = createFeatureSelector('investmenttypesData');

export const getInvestmentTypesEntities = createSelector(
  getInvestmentTypesStore,
  investmenttypesEntitySelectors.selectAll
);

export const getInvestmentTypes = createSelector(getInvestmentTypesEntities, entities => {
  return Object.values(entities);
});

export const getInvestmentTypesLoaded = createSelector(
  getInvestmentTypesStore, (investmenttypesStore: State) => investmenttypesStore.isInvestmentTypesLoaded);

export const getInvestmentTypesLoading = createSelector(
  getInvestmentTypesStore,
  (investmenttypesStore: State) => investmenttypesStore.isInvestmentTypesLoading);

export const getInvestmentTypesError = createSelector(
  getInvestmentTypesStore,
  (investmenttypesStore: State) => investmenttypesStore.error);

