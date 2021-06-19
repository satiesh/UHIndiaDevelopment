/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { investorlevel } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<investorlevel> {
  isInvestorLevelLoading?: boolean;
  isInvestorLevelLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<investorlevel> = createEntityAdapter<investorlevel>();

export const initialState: State = adapter.getInitialState({
  isInvestorLevelLoading: false,
  isInvestorLevelLoaded: false,
  error: null
});
