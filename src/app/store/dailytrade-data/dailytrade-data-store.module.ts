/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DailyTickerDataEffects } from './dailytrade-data.effects';
import { dailytradeDataReducer } from './dailytrade-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('dailytradeData', dailytradeDataReducer),
    EffectsModule.forFeature([DailyTickerDataEffects])
  ],
  providers: [DailyTickerDataEffects]
})
export class DailyTradeDataStoreModule { }
