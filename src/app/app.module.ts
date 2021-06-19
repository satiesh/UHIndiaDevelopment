// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule, DatePipe, CurrencyPipe} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firebase services + enviorment module
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastaModule } from 'ngx-toasta';


import { EncrDecrService } from '@app/services/encrdecr.service';
import { environment } from '@environments/environment';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import {
  LoginComponent, LoginControlComponent, RegisterComponent,
  RegisterControlComponent, ForgotPasswordComponent, VerifyEmailComponent,
  SetProfileComponent
} from '@app/components';

import {
  AuthService, AlertService, AppTranslationService,
  TranslateLanguageLoader, ConfigurationService, LocalStoreManager,
  AppTitleService, UserService, EmailService
} from '@app/services';

import { NotificationService } from '@app/services/notification.service';
import { NotificationEndpoint } from '@app/services/notification-endpoint.service';

import { AuthenticatedModule } from '@app/components/layouts/authenticated/authenticated.module';
import { UHMaterialModule } from '@app/modules/material.module';
import { SharedModule } from '@app/shared/shared.module'
import { MessagingService } from './services/messaging.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StockOfTheDayComponent } from '@app/components/stockoftheday/stockoftheday.component';
import { NewDailyTradeComponent } from './new-daily-trade/new-daily-trade.component';
import { CoursePurchaseComponent } from './course-purchase/course-purchase.component';

@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    LoginComponent,
    LoginControlComponent,
    RegisterComponent,
    StockOfTheDayComponent,
    RegisterControlComponent,
    VerifyEmailComponent,
    SetProfileComponent,
    LoginControlComponent,
    NewDailyTradeComponent,
    CoursePurchaseComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    ToastaModule.forRoot(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthenticatedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UHMaterialModule,
    SharedModule,
    //CKEditorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),],

  providers: [
    DatePipe,
    CurrencyPipe,
    AuthService,
    AlertService,
    EmailService,
    ConfigurationService,
    AppTranslationService,
    LocalStoreManager,
    AppTitleService,
    UserService,
    NotificationService,
    NotificationEndpoint,
    MessagingService, EncrDecrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
