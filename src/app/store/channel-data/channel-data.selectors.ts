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

import { State, adapter } from './channel-data.state';
import { channelEntitySelectors } from './channel-data.reducer';
import { channel } from '../../models';
import { Utilities } from '../../services';


export const getError = (state: State): any => state.error;
export const getChannelLoading = (state: State): boolean => state.isChannelLoading;
export const getChannelLoaded = (state: State): boolean => state.isChannelLoaded;

export const selectChannelState: MemoizedSelector<object, State> = createFeatureSelector<State>('channelData');

export const selectChannelsLoading: MemoizedSelector<object, boolean> = createSelector(selectChannelState, getChannelLoading);
export const selectChannelsLoaded: MemoizedSelector<object, boolean> = createSelector(selectChannelState, getChannelLoaded);
export const selectChannels: (state: object) => channel[] = adapter.getSelectors(selectChannelState).selectAll;

//export const selectChannelByTodaysDate = () =>
//  createSelector(selectChannels, (allChannels: channel[]) => {
//    if (allChannels) {
//      return allChannels.filter(p => moment(Utilities.transformSecondsToDate(p.createdon)).format("MM/DD/YYYY") == moment().format("MM/DD/YYYY") && p.isactive == true);
//    } else {
//      return null;
//    }
//  });
export const selectError: MemoizedSelector<object, any> = createSelector(selectChannelState, getError);

