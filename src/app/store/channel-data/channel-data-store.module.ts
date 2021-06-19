/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ChannelDataEffects } from './channel-data.effects';
import { channelDataReducer } from './channel-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('channelData', channelDataReducer),
    EffectsModule.forFeature([ChannelDataEffects])
  ],
  providers: [ChannelDataEffects]
})
export class ChannelDataStoreModule { }
