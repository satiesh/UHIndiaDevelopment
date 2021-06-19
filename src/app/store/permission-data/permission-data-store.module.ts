/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PermissionsDataEffects } from './permission-data.effects';
import { permissionsDataReducer } from './permission-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('permissionsData', permissionsDataReducer),
    EffectsModule.forFeature([PermissionsDataEffects])
  ],
  providers: [PermissionsDataEffects]
})
export class PermissionsDataStoreModule { }
