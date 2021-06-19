/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { NgModule, enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


import { CoursesDataStoreModule } from './course-data'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@environments/environment';
import { UsersDataStoreModule } from './user-data';
import { CurrentUsersDataStoreModule } from './currentuser-data';
import { RolesDataStoreModule } from './role-data';
import { PermissionsDataStoreModule } from './permission-data';
import { SubscriptionDataStoreModule } from './subscription-data';
import { InvestmentTypesDataStoreModule } from './investmenttypes-data';
import { InvestorLevelDataStoreModule } from './investorlevel-data';
import { TradingToolsDataStoreModule } from './tradingtools-data';
import { DailyTradeDataStoreModule } from './dailytrade-data';
import { ChannelDataStoreModule } from './channel-data';
import { OptionsTradeDataStoreModule } from './optionstrade-data';
import { UserOptionTradeDataStoreModule } from './useroptiontrade-data';
import { QuestionDataStoreModule } from './question-data';
import { CouponDataStoreModule } from './coupon-data';
import { TemplateDataStoreModule } from './template-data';

let devTools = [
  StoreDevtoolsModule.instrument({
    name: 'Urbanhood',
    maxAge: 25
  })
];
if (!environment.storeDevToolsEnabled) {
  devTools = [];
}
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoursesDataStoreModule,
    UsersDataStoreModule,
    CurrentUsersDataStoreModule,
    RolesDataStoreModule,
    PermissionsDataStoreModule,
    SubscriptionDataStoreModule,
    InvestmentTypesDataStoreModule,
    InvestorLevelDataStoreModule,
    TradingToolsDataStoreModule,
    DailyTradeDataStoreModule,
    ChannelDataStoreModule,
    OptionsTradeDataStoreModule,
    UserOptionTradeDataStoreModule,
    QuestionDataStoreModule,
    CouponDataStoreModule,
    TemplateDataStoreModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    ...devTools
  ]
})
export class RootStoreModule { }
