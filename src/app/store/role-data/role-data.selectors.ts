/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import { State } from './role-data.state';
import { roleEntitySelectors } from './role-data.reducer';


export const getRoleStore = createFeatureSelector('rolesData');

export const getRoleEntities = createSelector(
  getRoleStore,
  roleEntitySelectors.selectAll
);

export const getRole = createSelector(getRoleEntities, entities => {
  return Object.values(entities);
});

export const getRoleLoaded = createSelector(
  getRoleStore, (roleStore: State) => roleStore.isRolesLoaded);

export const getRoleLoading = createSelector(
  getRoleStore,
  (roleStore: State) => roleStore.isRolesLoading);

export const getRoleError = createSelector(
  getRoleStore,
  (roleStore: State) => roleStore.error);

