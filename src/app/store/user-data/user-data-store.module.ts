/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UsersDataEffects } from './user-data.effects';
import { usersDataReducer } from './user-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('usersData', usersDataReducer),
    EffectsModule.forFeature([UsersDataEffects])
  ],
  providers: [UsersDataEffects]
})
export class UsersDataStoreModule { }
