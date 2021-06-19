/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Permission } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<Permission> {
  isPermissionsLoading?: boolean;
  isPermissionsLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<Permission> = createEntityAdapter<Permission>();

export const initialState: State = adapter.getInitialState({
  isPermissionsLoading: false,
  isPermissionsLoaded: false,
  error: null
});
