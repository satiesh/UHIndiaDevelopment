/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import { State } from './permission-data.state';
import { permissionEntitySelectors } from './permission-data.reducer';


export const getPermissionStore = createFeatureSelector('permissionsData');

export const getPermissionEntities = createSelector(
  getPermissionStore,
  permissionEntitySelectors.selectAll
);

export const getPermission = createSelector(getPermissionEntities, entities => {
  return Object.values(entities);
});

export const getPermissionLoaded = createSelector(
  getPermissionStore, (permissionStore: State) => permissionStore.isPermissionsLoaded);

export const getPermissionLoading = createSelector(
  getPermissionStore,
  (permissionStore: State) => permissionStore.isPermissionsLoading);

export const getPermissionError = createSelector(
  getPermissionStore,
  (permissionStore: State) => permissionStore.error);

