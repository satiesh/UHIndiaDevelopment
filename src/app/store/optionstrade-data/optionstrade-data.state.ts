/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { optionstrade } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<optionstrade> {
  isOptionsTradeLoading?: boolean;
  isOptionsTradeLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<optionstrade> = createEntityAdapter<optionstrade>();

export const initialState: State = adapter.getInitialState({
  isOptionsTradeLoading: false,
  isOptionsTradeLoaded: false,
  error: null
});
