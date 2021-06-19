import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, DefaultUrlSerializer, UrlTree, UrlSerializer } from '@angular/router';

// Import all the components for which navigation service has to be activated 
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from '@app/components/forgotpassword/forgot-password.component';
import { VerifyEmailComponent } from '@app/components/verify/verifyemail.component';
import { AuthenticatedComponent } from '@app/components/layouts/authenticated/authenticated.component';
import { LoginComponent } from '@app/components/login/login.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { Utilities } from '@app/services/utilities';
import { AuthService } from '@app/services/auth.service';
import { AuthGuard } from '@app/services/auth-guard.service';
import {
   ProfileComponent, RedirectComponent,
  SetProfileComponent, UserListComponent,  SubscriptonListComponent, EditOptionsTradeDialogComponent, OptionsTradeEditorComponent
} from '@app/components';
import { CoursesComponent } from '@app/components/learning/courses/courses.component';
import { RoleListComponent } from '@app/components/admin/role-list/role-list.component';
import { DailyTradeListComponent } from '@app/components/admin/dailytrade-list/dailytrade-list.component';
import { OptionsTradeListComponent } from '@app/components/admin/optionstrade-list/optionstrade-list.component';
import { CouponListComponent } from '@app/components/admin/coupon-list/coupon-list.component';
import { MessagingHomeComponent } from './components/admin/messaging-home/messaging-home.component';
import { ChannelListComponent } from './components/admin/channel-list/channel-list.component';
import { TemplateListComponent } from './components/admin/template-list/template-list.component';
import { EveryTradeComponent } from './components/everydaytrades/everydaytrade.component';
import { TradeComponent } from './components/everydaytrades/trade.component';
import { ReportComponent } from './components/reports/reports.component';
import { StockOfTheDayComponent } from './components/stockoftheday/stockoftheday.component';
import { NewDailyTradeComponent } from './new-daily-trade/new-daily-trade.component';
import { CoursePurchaseComponent } from './course-purchase/course-purchase.component';
import { CourseBuyComponent } from './components/learning/course-buy/course-buy.component';



@Injectable()
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    parse(url: string): UrlTree {
        const possibleSeparators = /[?;#]/;
        const indexOfSeparator = url.search(possibleSeparators);
        let processedUrl: string;

        if (indexOfSeparator > -1) {
            const separator = url.charAt(indexOfSeparator);
            const urlParts = Utilities.splitInTwo(url, separator);
            urlParts.firstPart = urlParts.firstPart.toLowerCase();

            processedUrl = urlParts.firstPart + separator + urlParts.secondPart;
        } else {
            processedUrl = url.toLowerCase();
        }

        return super.parse(processedUrl);
    }
}



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent ,},
  { path: 'register', component: RegisterComponent },
  { path: 'redirect', component: RedirectComponent },
  { path: 'stockoftheday', component: StockOfTheDayComponent },
  { path: 'setprofile',component:SetProfileComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthenticatedComponent, canActivate: [AuthGuard],
    children:[
      {
      path:'dashboard',
      component:DashboardComponent, canActivate: [AuthGuard]
      },
      {
        path: 'dailytrade',
        component: EveryTradeComponent,canActivate:[AuthGuard]
      },
      {
        path: 'trades',
        component: TradeComponent, canActivate: [AuthGuard]
      },
      {
        path: 'courses',
        component: CoursesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        component: ReportComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/users',
        component: UserListComponent, canActivate: [AuthGuard],data: { title: 'Users' }
      },
      {
        path: 'admin/roles',
        component: RoleListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/subscription',
        component: SubscriptonListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/dailytrade',
        component: DailyTradeListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/optionstrade',
        component: OptionsTradeListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/newtrade',
        component: OptionsTradeEditorComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/coupons',
        component: CouponListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/messaging',
        component: MessagingHomeComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/channels',
        component: ChannelListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/templates',
        component: TemplateListComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/new-daily-trade',
        component: NewDailyTradeComponent, canActivate: [AuthGuard]
      },

   {      path:'profile',
         component:ProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'course-purchase',
    component: CourseBuyComponent, canActivate: [AuthGuard]
  }
] },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'verifyemail', component: VerifyEmailComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthService,
    AuthGuard,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }]
})
export class AppRoutingModule { }
