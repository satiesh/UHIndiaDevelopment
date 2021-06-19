import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { NgxStripeModule } from 'ngx-stripe';


import { UHMaterialModule } from '@app/modules/material.module';
import { PageHeaderComponent } from '@app/shared/pages-header/page-header.component';
import { ProfileControlComponent } from '@app/components/controls/profile-control.component';
import { SubscriptionComponent } from '@app/components/controls/subscription.component';
import { DisclaimerControlComponent } from '@app/components/controls/disclaimer-control.component';
import { PortfolioControlComponent } from '@app/components/controls/portfolio-control.component';
import { PaymentControlComponent } from '@app/components/controls/payment-control.component';
import { SummaryControlComponent } from '@app/components/controls/summary-control.component';
import { QuestionerControlComponent } from '@app/components/controls/questioner-control.component';

import { RootStoreModule } from '@app/store';
import { AppDialogComponent } from '@app/shared/app-dialog/app-dialog.component';
import { PdfComponent} from '../components';
import { DisclaimerIControlComponent } from '@app/components/controls/disclaimerI-control.component';
import { environment } from '@environments/environment';

@NgModule({
  declarations: [
    PageHeaderComponent,
    ProfileControlComponent,
    SubscriptionComponent,
    DisclaimerControlComponent,
    PortfolioControlComponent,
    PaymentControlComponent,
    PdfComponent,
    DisclaimerIControlComponent,
    SummaryControlComponent,
    QuestionerControlComponent,
    AppDialogComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    RootStoreModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    UHMaterialModule,
    TranslateModule,
    //NgxStripeModule.forRoot('pk_test_51HN7MiHZ4XNG0JRpoaJt2gVdwVPJWU8fQCMT5x4m42lmkYMgorTcyj2GsNagc5YmLxaBOwGUO0frLQ8k9EyziMvp008UGBFFei')
    NgxStripeModule.forRoot(environment.stripeApi)
    
    
  ],
  exports: [
    FlexLayoutModule,
    FormsModule,
    //RootStoreModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    PageHeaderComponent,
    ProfileControlComponent,
    SubscriptionComponent,
    DisclaimerControlComponent,
    PortfolioControlComponent,
    PaymentControlComponent,
    SummaryControlComponent,
    QuestionerControlComponent,
    DisclaimerIControlComponent,
    PdfComponent,
    UHMaterialModule,
    TranslateModule,
    NgxStripeModule,
    AppDialogComponent
  ]
})
export class SharedModule { }
