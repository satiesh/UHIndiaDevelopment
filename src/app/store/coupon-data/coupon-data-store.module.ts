/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CouponDataEffects } from './coupon-data.effects';
import { couponsDataReducer } from './coupon-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('couponsData', couponsDataReducer),
    EffectsModule.forFeature([CouponDataEffects])
  ],
  providers: [CouponDataEffects]
})
export class CouponDataStoreModule { }
