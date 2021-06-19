/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */


import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '@app/models/user';

export interface State extends EntityState<User> {
  isCurrentUserLoading?: boolean;
  isCurrentUserLoaded?: boolean;
  isProfileUpdating?: boolean;
  isProfileUpdated?: boolean;
  currentusersData: any;
  error?: any;
}
export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState({
  isCurrentUserLoading: false,
  isCurrentUserLoaded: false,
  isProfileUpdating: false,
  isProfileUpdated: false,
  currentusersData: null,
  error: null
});
