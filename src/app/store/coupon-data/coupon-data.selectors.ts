import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { adapter, State } from './coupon-data.state';
import { coupons } from '@app/models/coupons';

export const getError = (state: State): any => state.error;
export const getIsCouponsLoading = (state: State): boolean => state.isCouponLoading;
export const getIsCouponsLoaded = (state: State): boolean => state.isCouponLoaded;

export const selectCouponState: MemoizedSelector<object,State> = createFeatureSelector<State>('couponsData');

export const selectCouponsLoading: MemoizedSelector<object, boolean> = createSelector(selectCouponState, getIsCouponsLoading);
export const selectCouponsLoaded: MemoizedSelector<object, boolean> = createSelector(selectCouponState, getIsCouponsLoaded);
export const selectCoupons: (state: object) => coupons[] = adapter.getSelectors(selectCouponState).selectAll;
export const selectError: MemoizedSelector<object, any> = createSelector(selectCouponState, getError);
export const selectCouponByName = (name: string) =>
  createSelector(selectCoupons, (allCoupons: coupons[]) => {
    if (allCoupons) {
      return allCoupons.find(p => p.name.trim() === name.trim());
    } else {
      return null;
    }
  });
