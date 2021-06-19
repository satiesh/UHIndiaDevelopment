import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { adapter, State } from './user-data.state';
import { User } from '@app/models/user';

export const getError = (state: State): any => state.error;
export const getIsUsersLoading = (state: State): boolean => state.isUserLoading;
export const getIsUsersLoaded = (state: State): boolean => state.isUserLoaded;

export const selectUserState: MemoizedSelector<object, State> = createFeatureSelector<State>('usersData');

export const selectUsersLoading: MemoizedSelector<object, boolean> = createSelector(selectUserState, getIsUsersLoading);
export const selectUsersLoaded: MemoizedSelector<object, boolean> = createSelector(selectUserState, getIsUsersLoaded);
export const selectUsers: (state: object) => User[] = adapter.getSelectors(selectUserState).selectAll;
export const selectError: MemoizedSelector<object, any> = createSelector(selectUserState, getError);

export const selectUserByRoleId = (roleName: string) =>
  createSelector(selectUsers, (allUsers: User[]) => {
    if (allUsers) {
      return allUsers.filter(p => p.userroles.roleName.split(',').find(p => p === roleName.trim()));
    } else {
      return null;
    }
  });

export const selectUserById = (id: string) =>
  createSelector(selectUsers, (allUsers: User[]) => {
    if (allUsers) {
      return allUsers.find(p => p.uid.trim() === id.trim());
    } else {
      return null;
    }
  });
export const selectUserByEmail = (email: string) =>
  createSelector(selectUsers, (allUsers: User[]) => {
    if (allUsers) {
      return allUsers.find(p => p.email.trim().toLowerCase() === email.trim().toLowerCase());
    } else {
      return null;
    }
  });
