/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { Courses } from '@app/models/courses';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<Courses> {
  isLoading?: boolean;
  isCourseLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<Courses> = createEntityAdapter<Courses>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  isCourseLoaded: false,
  error: null
});
