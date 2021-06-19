/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserOptionTradeDataEffects } from './useroptiontrade-data.effects';
import { useroptiontradeDataReducer } from './useroptiontrade-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('useroptiontradesData', useroptiontradeDataReducer),
    EffectsModule.forFeature([UserOptionTradeDataEffects])
  ],
  providers: [UserOptionTradeDataEffects]
})
export class UserOptionTradeDataStoreModule { }
