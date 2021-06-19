/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { tradingtools } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<tradingtools> {
  isTradingToolsLoading?: boolean;
  isTradingToolsLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<tradingtools> = createEntityAdapter<tradingtools>();

export const initialState: State = adapter.getInitialState({
  isTradingToolsLoading: false,
  isTradingToolsLoaded: false,
  error: null
});
