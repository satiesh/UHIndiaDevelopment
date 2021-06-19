/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { QuestionDataEffects } from './question-data.effects';
import { questionDataReducer } from './question-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('questionData', questionDataReducer),
    EffectsModule.forFeature([QuestionDataEffects])
  ],
  providers: [QuestionDataEffects]
})
export class QuestionDataStoreModule { }
