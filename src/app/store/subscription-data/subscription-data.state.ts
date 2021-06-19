/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { ServiceSubscription } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<ServiceSubscription> {
  issubscriptionDataLoading?: boolean;
  issubscriptionDataLoaded?: boolean;
  selectedSubscriptionId?: string;
  error?: any;
}
export const adapter: EntityAdapter<ServiceSubscription> = createEntityAdapter<ServiceSubscription>();

export const initialState: State = adapter.getInitialState({
  issubscriptionDataLoading: false,
  issubscriptionDataLoaded: false,
  selectedSubscriptionId: null,
  error: null
});
