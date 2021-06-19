/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { InvestorLevelDataEffects } from './investorlevel-data.effects';
import { investorlevelDataReducer } from './investorlevel-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('investorlevelData', investorlevelDataReducer),
    EffectsModule.forFeature([InvestorLevelDataEffects])
  ],
  providers: [InvestorLevelDataEffects]
})
export class InvestorLevelDataStoreModule { }
