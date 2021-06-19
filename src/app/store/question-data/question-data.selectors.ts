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

import { State, adapter } from './question-data.state';
import { questions } from '../../models';
import { Utilities } from '../../services';


export const getError = (state: State): any => state.error;
export const getQuestionLoading = (state: State): boolean => state.isQuestionLoading;
export const getQuestionLoaded = (state: State): boolean => state.isQuestionLoaded;

export const selectQuestionState: MemoizedSelector<object, State> = createFeatureSelector<State>('questionData');

export const selectQuestionsLoading: MemoizedSelector<object, boolean> = createSelector(selectQuestionState, getQuestionLoading);
export const selectQuestionsLoaded: MemoizedSelector<object, boolean> = createSelector(selectQuestionState, getQuestionLoaded);
export const selectQuestions: (state: object) => questions[] = adapter.getSelectors(selectQuestionState).selectAll;

export const selectQuestionByTodaysDate = () =>
  createSelector(selectQuestions, (allQuestions: questions[]) => {
    if (allQuestions) {
      return allQuestions.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY") && p.isactive == true);
    } else {
      return null;
    }
  });
export const selectError: MemoizedSelector<object, any> = createSelector(selectQuestionState, getError);

