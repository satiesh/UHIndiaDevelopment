/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */


import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '@app/models/user';

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();


export interface State extends EntityState<User> {
  isUserLoading?: boolean;
  isUserLoaded?: boolean;
  error?: any;
}

export const initialState: State = adapter.getInitialState({
  isUserLoading: false,
  isUserLoaded: false,
  error: null
});
