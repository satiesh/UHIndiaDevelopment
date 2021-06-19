/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { investmenttypes } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<investmenttypes> {
  isInvestmentTypesLoading?: boolean;
  isInvestmentTypesLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<investmenttypes> = createEntityAdapter<investmenttypes>();

export const initialState: State = adapter.getInitialState({
  isInvestmentTypesLoading: false,
  isInvestmentTypesLoaded: false,
  error: null
});
