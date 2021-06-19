/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TemplateDataEffects } from './template-data.effects';
import { templateDataReducer } from './template-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('templateData', templateDataReducer),
    EffectsModule.forFeature([TemplateDataEffects])
  ],
  providers: [TemplateDataEffects]
})
export class TemplateDataStoreModule { }
