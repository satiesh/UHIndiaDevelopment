/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { InvestmentTypesDataEffects } from './investmenttypes-data.effects';
import { investmenttypesDataReducer } from './investmenttypes-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('investmenttypesData', investmenttypesDataReducer),
    EffectsModule.forFeature([InvestmentTypesDataEffects])
  ],
  providers: [InvestmentTypesDataEffects]
})
export class InvestmentTypesDataStoreModule { }
