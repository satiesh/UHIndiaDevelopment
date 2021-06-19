/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TradingToolsDataEffects } from './tradingtools-data.effects';
import { tradingtoolDataReducer } from './tradingtools-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('tradingtoolsData', tradingtoolDataReducer),
    EffectsModule.forFeature([TradingToolsDataEffects])
  ],
  providers: [TradingToolsDataEffects]
})
export class TradingToolsDataStoreModule { }
