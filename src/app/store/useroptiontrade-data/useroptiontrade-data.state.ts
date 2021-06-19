/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */


import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { useroptiontrades } from '../../models/useroptiontrade';

export const adapter: EntityAdapter<useroptiontrades> = createEntityAdapter<useroptiontrades>();


export interface State extends EntityState<useroptiontrades> {
  isUserOptionTradeLoading?: boolean;
  isUserOptionTradeLoaded?: boolean;
  error?: any;
}

export const initialState: State = adapter.getInitialState({
  isUserOptionTradeLoading: false,
  isUserOptionTradeLoaded: false,
  error: null
});
