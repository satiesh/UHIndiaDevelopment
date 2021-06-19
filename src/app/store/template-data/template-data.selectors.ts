/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import * as moment from 'moment';

import { State, adapter } from './template-data.state';
import { template } from '../../models';


export const getError = (state: State): any => state.error;
export const getTemplateLoading = (state: State): boolean => state.isTemplateLoading;
export const getTemplateLoaded = (state: State): boolean => state.isTemplateLoaded;

export const selectTemplateState: MemoizedSelector<object, State> = createFeatureSelector<State>('templateData');

export const selectTemplatesLoading: MemoizedSelector<object, boolean> = createSelector(selectTemplateState, getTemplateLoading);
export const selectTemplatesLoaded: MemoizedSelector<object, boolean> = createSelector(selectTemplateState, getTemplateLoaded);
export const selectTemplates: (state: object) => template[] = adapter.getSelectors(selectTemplateState).selectAll;

//export const selectTemplateByTodaysDate = () =>
//  createSelector(selectTemplates, (allTemplates: template[]) => {
//    if (allTemplates) {
//      return allTemplates.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY") && p.isactive == true);
//    } else {
//      return null;
//    }
//  });
export const selectError: MemoizedSelector<object, any> = createSelector(selectTemplateState, getError);

