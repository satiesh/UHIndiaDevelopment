/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */


import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { coupons } from '@app/models/coupons';

export const adapter: EntityAdapter<coupons> = createEntityAdapter<coupons>();


export interface State extends EntityState<coupons> {
  isCouponLoading?: boolean;
  isCouponLoaded?: boolean;
  error?: any;
}

export const initialState: State = adapter.getInitialState({
  isCouponLoading: false,
  isCouponLoaded: false,
  error: null
});
