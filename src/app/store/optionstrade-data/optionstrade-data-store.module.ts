/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OptionsTradeDataEffects } from './optionstrade-data.effects';
import { optionstradeDataReducer } from './optionstrade-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('optionstradeData', optionstradeDataReducer),
    EffectsModule.forFeature([OptionsTradeDataEffects])
  ],
  providers: [OptionsTradeDataEffects]
})
export class OptionsTradeDataStoreModule { }
