/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { adapter, State } from './current-contextuser-data.state';
//import { currentUserEntitySelectors } from './current-contextuser-data.reducer';
import { User } from '../../models/user';
export const getError = (state: State): any => state.error;
export const getIsCurrentUsersLoading = (state: State): boolean => state.isCurrentUserLoading;
export const getIsCurrentUsersLoaded = (state: State): boolean => state.isCurrentUserLoaded;

export const selectUserState: MemoizedSelector<object, State> = createFeatureSelector<State>('currentusersData');

export const selectIsCurrentUsersLoading: MemoizedSelector<object, boolean> = createSelector(selectUserState, getIsCurrentUsersLoading);
export const selectIsCurrentUsersLoaded: MemoizedSelector<object, boolean> = createSelector(selectUserState, getIsCurrentUsersLoaded);
export const selectUsers: (state: object) => User[] = adapter.getSelectors(selectUserState).selectAll;
export const selectError: MemoizedSelector<object, any> = createSelector(selectUserState, getError);


export const selectUserById = (id: string) =>
   createSelector(selectUsers, (allUsers: User[]) => {
    if (allUsers) {
      return allUsers.find(p => p.uid.trim() === id.trim());
    } else {
      return null;
    }
  });
export const deleteUser = (id: string) =>
    deleteSelector(selectUsers, (allUsers: User[]) => {

 });



function deleteSelector(selectUsers: (state: object) => User[], arg1: (allUsers: User[]) => void) {
  throw new Error('Function not implemented.');
}
//export const getCurrentUserStore = createFeatureSelector('currentusersData');

//export const getCurrentUserEntities = createSelector(
//  getCurrentUserStore,
//  currentUserEntitySelectors.selectAll
//);

//export const getCurrentUser = createSelector(getCurrentUserEntities, entities => {
//  return Object.values(entities);
//});

//export const getCurrentUserLoaded = createSelector(
//  getCurrentUserStore, (currentUserStore: State) => currentUserStore.isCurrentUserLoaded);

//export const getCurrentUserLoading = createSelector(
//  getCurrentUserStore,
//  (currentUserStore: State) => currentUserStore.isCurrentUserLoading);

//export const getCurrentUserError = createSelector(
//  getCurrentUserStore,
//  (currentUserStore: State) => currentUserStore.error);
