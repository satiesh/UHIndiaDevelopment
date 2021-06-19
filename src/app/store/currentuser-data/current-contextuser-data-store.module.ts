/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CurrentUsersDataEffects } from './current-contextuser-data.effects';
import { currentUsersDataReducer } from './current-contextuser-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('currentusersData', currentUsersDataReducer),
    EffectsModule.forFeature([CurrentUsersDataEffects])
  ],
  providers: [CurrentUsersDataEffects]
})
export class CurrentUsersDataStoreModule { }
