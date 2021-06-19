/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RolesDataEffects } from './role-data.effects';
import { rolesDataReducer } from './role-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('rolesData', rolesDataReducer),
    EffectsModule.forFeature([RolesDataEffects])
  ],
  providers: [RolesDataEffects]
})
export class RolesDataStoreModule { }
