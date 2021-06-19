/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SubscriptionDataEffects } from './subscription-data.effects';
import { subscriptionDataReducer } from './subscription-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('subscriptionData', subscriptionDataReducer),
    EffectsModule.forFeature([SubscriptionDataEffects])
  ],
  providers: [SubscriptionDataEffects]
})
export class SubscriptionDataStoreModule { }
