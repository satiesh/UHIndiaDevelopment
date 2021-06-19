/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CoursesDataEffects } from './course-data.effects';
import { coursesDataReducer } from './course-data.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('coursesData', coursesDataReducer),
    EffectsModule.forFeature([CoursesDataEffects])
  ],
  providers: [CoursesDataEffects]
})
export class CoursesDataStoreModule { }
