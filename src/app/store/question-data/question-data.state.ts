/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { questions } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<questions> {
  isQuestionLoading?: boolean;
  isQuestionLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<questions> = createEntityAdapter<questions>();

export const initialState: State = adapter.getInitialState({
  isQuestionLoading: false,
  isQuestionLoaded: false,
  error: null
});
