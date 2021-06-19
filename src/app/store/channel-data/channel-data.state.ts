/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { channel } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<channel> {
  isChannelLoading?: boolean;
  isChannelLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<channel> = createEntityAdapter<channel>();

export const initialState: State = adapter.getInitialState({
  isChannelLoading: false,
  isChannelLoaded: false,
  error: null
});
