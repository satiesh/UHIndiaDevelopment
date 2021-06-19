/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { adapter,State } from './subscription-data.state';
import { ServiceSubscription } from '../../models';


export const getError = (state: State): any => state.error;
export const getSubscriptionLoading = (state: State): boolean => state.issubscriptionDataLoading;
export const getSubscriptionLoaded = (state: State): boolean => state.issubscriptionDataLoaded;

export const selectSubscriptionState: MemoizedSelector<object, State> = createFeatureSelector<State>('subscriptionData');

export const selectSubscriptionsLoading: MemoizedSelector<object, boolean> = createSelector(selectSubscriptionState, getSubscriptionLoading);
export const selectSubscriptionsLoaded: MemoizedSelector<object, boolean> = createSelector(selectSubscriptionState, getSubscriptionLoaded);
export const selectSubscriptions: (state: object) => ServiceSubscription[] = adapter.getSelectors(selectSubscriptionState).selectAll;

export const selectSubscriptionWithoutAlreadyPaid = (id: string) =>
  createSelector(selectSubscriptions, (allSubscriptions: ServiceSubscription[]) => {
    if (allSubscriptions) {
      return allSubscriptions.filter(p => p.id !== id);
    } else {
      return null;
    }
  });
export const selectSubscriptionWithoutAlreadyPaidAndFree = () =>
  createSelector(selectSubscriptions, (allSubscriptions: ServiceSubscription[]) => {
    if (allSubscriptions) {
      return allSubscriptions.filter(p => p.id !== 'SoPquyCYSl6LSIFcm8xY' && p.id !== 'WNiJ2h1kpYD83EzTpdaM');
    } else {
      return null;
    }
  });
export const selectSubscriptionById = (id: string) =>
  createSelector(selectSubscriptions, (allSubscriptions: ServiceSubscription[]) => {
    if (allSubscriptions) {
      return allSubscriptions.find(p => p.id.trim() === id.trim());
    } else {
      return null;
    }
  });
export const selectActiveSubscription = () =>
  createSelector(selectSubscriptions, (allSubscriptions: ServiceSubscription[]) => {
    if (allSubscriptions) {
      return allSubscriptions.find(p => p.IsActive== true);
    } else {
      return null;
    }
  });
export const selectError: MemoizedSelector<object, any> = createSelector(selectSubscriptionState, getError);





