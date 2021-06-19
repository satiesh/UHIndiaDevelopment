/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Roles } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<Roles> {
  isRolesLoading?: boolean;
  isRolesLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<Roles> = createEntityAdapter<Roles>();

export const initialState: State = adapter.getInitialState({
  isRolesLoading: false,
  isRolesLoaded: false,
  error: null
});
