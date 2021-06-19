/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { dailyticker } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<dailyticker> {
  isDailyTradeLoading?: boolean;
  isDailyTradeLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<dailyticker> = createEntityAdapter<dailyticker>();

export const initialState: State = adapter.getInitialState({
  isDailyTradeLoading: false,
  isDailyTradeLoaded: false,
  error: null
});
