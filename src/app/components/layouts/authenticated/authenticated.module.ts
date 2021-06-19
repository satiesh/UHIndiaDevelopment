import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthenticatedComponent } from './authenticated.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GoogleChartsModule } from 'angular-google-charts';
import { SharedModule } from '@app/shared/shared.module';
import {
  AlertService, ConfigurationService, AppTitleService,
  AppTranslationService, LocalStoreManager, AppService,
  AccountService, ValidationService
} from '@app/services';

import { FooterModule } from '@app/components/layouts/shared/footer/footer.component';
import {
  ProfileComponent, 
  CourseDetailDialogComponent, RedirectComponent, UserListComponent,
  EditCourseDialogComponent, SubscriptonListComponent, EditSubscriptionDialogComponent,
  SubscriptionEditorComponent, PermissionListComponent, RegisterCourseDialogComponent,
  CourseEditorComponent, CoursePaymentComponent, UserRolesComponent, UserOtherInfoComponent,
  UserPaymentComponent,
  UserSubscriptionListComponent,
  DailyTradeEditorComponent,
  OptionsTradeEditorComponent,
  OptionsTradeCommentComponent, OptionsTradeViewComponent 
} from '@app/components';
import { CoursesComponent } from '@app/components/learning/courses/courses.component';
import { EditUserDialogComponent } from '@app/components/admin/user-dialog/user-dialog.component';
import { EditRoleDialogComponent } from '@app/components/admin/role-dialog/role-dialog.component';
import { RoleEditorComponent } from '@app/components/admin/role-editor/role-editor.component';
import { RoleListComponent } from '@app/components/admin/role-list/role-list.component';
import { UserProfileEditorComponent } from '@app/components/admin/user-editor/user-profile.component';
import { DailyTradeListComponent } from '@app/components/admin/dailytrade-list/dailytrade-list.component';
import { DailyTickerComponent } from '@app/components/controls/dashboard/dailyticker-control.component';
import { OptionsTradeListComponent } from '@app/components/admin/optionstrade-list/optionstrade-list.component';
import { EditOptionsTradeDialogComponent } from '../../admin/optionstrade-dialog/optionstrade-dialog.component';
import { EditDailyTradeDialogComponent } from '../../admin/dailytrade-dialog/dailytrade-dialog.component';
import { OptionsTickerListComponent } from '../../controls/dashboard/optionticker-control.component';
import { UserSubscriptionCancelComponent } from '../../admin/user-editor/user-subscription-cancel.component';
import { UserSubscriptionChangeComponent } from '../../admin/user-editor/user-subscription-change.component';
import { UserInvestorLevelComponent } from '../../admin/user-editor/user-investorlevel.component';
import { UserInvestmentTypeComponent } from '../../admin/user-editor/user-investmenttype.component';
import { UserTradingToolsComponent } from '../../admin/user-editor/user-tradingtools.component';
import { UserDisclaimerComponent } from '../../admin/user-editor/user-disclaimer.component';
import { NewUserDialogComponent } from '../../admin/user-new-dialog/user-new-dialog.component';
import { DisclaimerDialogComponent } from '../../disclaimer-dialog/disclaimer-dialog.component';
import { CouponListComponent } from '../../admin/coupon-list/coupon-list.component';
import { EditCouponDialogComponent } from '../../admin/coupon-dialog/coupon-dialog.component';
import { CouponEditorComponent } from '../../admin/coupon-editor/coupon-editor.component';
import { MessagingHomeComponent } from '../../admin/messaging-home/messaging-home.component';
import { ChannelListComponent } from '../../admin/channel-list/channel-list.component';
import { EditChannelDialogComponent } from '../../admin/channel-dialog/channel-dialog.component';
import { ChannelEditorComponent } from '../../admin/channel-editor/channel-editor.component';
import { TemplateListComponent } from '../../admin/template-list/template-list.component';
import { EditTemplateDialogComponent } from '../../admin/template-dialog/template-dialog.component';
import { UserOtherValuesComponent } from '../../admin/user-editor/user-other-values.component';
import { MyProductComponent } from '../../controls/dashboard/myproduct-control.component';
import { EveryTradeComponent } from '../../everydaytrades/everydaytrade.component';
import { EveryDayTradeViewComponent } from '../../everydaytrades/everydaytradeview.component';
import { MYTradeOptionsComponent } from '../../controls/dashboard/mytradeoption-control.component';
import { MYTradeStockComponent } from '../../controls/dashboard/mytradestock-control.component';
import { TradeComponent } from '../../everydaytrades/trade.component';
import { OpenTradesComponent } from '../../everydaytrades/opentrades.component';
import { ClosedTradesComponent } from '../../everydaytrades/closedtrades.component';
import { ClosedStockTradesComponent } from '../../everydaytrades/closedstocktrades.component';
import { OpenStockTradesComponent } from '../../everydaytrades/openstocktrades.component';
import { AllTradesComponent } from '../../everydaytrades/alltrades.component';
import { FreeStockOfDayComponent } from '../../everydaytrades/freestockofday.component';
import { StockTradeCommentComponent } from '../../admin/optionstrade-editor/stocktrade-comment.component';
import { ClosedStockViewComponent } from '../../everydaytrades/closedstockview.component';
import { ClosedOptionTradeViewComponent } from '../../everydaytrades/closedoptiontradeview.component';
import { OpenOptionTradeViewComponent } from '../../everydaytrades/openoptiontradeview.component';
import { OpenStockTradeViewComponent } from '../../everydaytrades/openstocktradeview.component';
import { FreeStockControlComponent } from '../../controls/dashboard/freestock-control.component';
import { ReportComponent } from '../../reports/reports.component';
import { CourseBuyComponent } from '@app/components/learning/course-buy/course-buy.component';

@NgModule({
  declarations: [
    AuthenticatedComponent,
    DashboardComponent, ProfileComponent, RedirectComponent, CoursesComponent, CourseDetailDialogComponent, CourseEditorComponent, CoursePaymentComponent, RegisterCourseDialogComponent,
    UserListComponent, RoleListComponent, EditCourseDialogComponent, SubscriptonListComponent,
    EditSubscriptionDialogComponent, SubscriptionEditorComponent, EditRoleDialogComponent, RoleEditorComponent, EditUserDialogComponent,
    PermissionListComponent, UserProfileEditorComponent, UserRolesComponent, UserOtherInfoComponent, DailyTradeListComponent, DailyTickerComponent,
    UserPaymentComponent, UserSubscriptionListComponent, EditDailyTradeDialogComponent, DailyTradeEditorComponent, OptionsTradeListComponent,
    OptionsTradeViewComponent, EditOptionsTradeDialogComponent, OptionsTradeEditorComponent, OptionsTradeCommentComponent,
    OptionsTickerListComponent, UserSubscriptionCancelComponent, UserSubscriptionChangeComponent, UserInvestorLevelComponent,
    UserInvestmentTypeComponent, UserTradingToolsComponent, UserDisclaimerComponent, NewUserDialogComponent, DisclaimerDialogComponent, CouponListComponent,
    EditCouponDialogComponent, CouponEditorComponent, MessagingHomeComponent, ChannelListComponent, EditChannelDialogComponent, ChannelEditorComponent, TemplateListComponent,
    EditTemplateDialogComponent, UserOtherValuesComponent, MyProductComponent, EveryTradeComponent, EveryDayTradeViewComponent,
    MYTradeOptionsComponent, MYTradeStockComponent, TradeComponent, OpenTradesComponent, ClosedTradesComponent, OpenStockTradesComponent, ClosedStockTradesComponent, AllTradesComponent,
    FreeStockOfDayComponent, StockTradeCommentComponent, ClosedStockViewComponent, ClosedOptionTradeViewComponent, OpenOptionTradeViewComponent, OpenStockTradeViewComponent, FreeStockControlComponent,
    ReportComponent,CourseBuyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FooterModule,
    SharedModule,
    GoogleChartsModule,
    AngularEditorModule
  ],
  providers: [
    AlertService,
    AppService,
    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    AccountService,
    ValidationService,
    LocalStoreManager,
    CurrencyPipe
  ],
})
export class AuthenticatedModule { }
