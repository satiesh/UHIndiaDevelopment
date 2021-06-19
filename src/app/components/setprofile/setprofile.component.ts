// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PaymentIntent } from '@stripe/stripe-js';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { environment as env } from '@environments/environment';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { PdfService, Utilities, EmailService } from '../../services';
import {
  ProfileControlComponent, DisclaimerControlComponent,
  SubscriptionComponent, PaymentControlComponent, SummaryControlComponent, QuestionerControlComponent
} from '@app/components/controls';

import { AlertService, MessageSeverity, AccountService } from '@app/services';
import { userdisclaimer, userprofile, usersubscription, userpayment, userroles, ServiceSubscription, userquestions, sendinbluecontact, sendinblueWelcomeMail, sendinblueattributes, sendinbluetoaddress, Purchase, paramsvalues, sendinblueattachment } from '@app/models';
import { RootStoreState, SubscriptionStoreSelectors, SubscriptionStoreActions, QuestionStoreSelectors, QuestionStoreActions, CurrentUsersStoreActions } from '@app/store';
import { User } from '../../models/User';
import { newuser } from '../../models/newuser';
import { subscriptions } from '../../models/subscriptions';
import { PdfComponent } from '../controls/pdf.component';
import { DisclaimerIControlComponent } from '../controls/disclaimerI-control.component';
import { questionpdfarray } from '../../models/questionpadfarray';


@Component({
  selector: 'app-newuser-profile',
  templateUrl: './setprofile.component.html',
  styleUrls: ['./setprofile.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class SetProfileComponent implements OnInit {

  @ViewChild(MatHorizontalStepper)
  stepper: MatHorizontalStepper;
  isProduction: boolean = env.production;
  isPaymentProcessing: boolean = false;
  currentuserid: string;
  currentuseremail: string;
  userDisclaimer: userdisclaimer;
  userProfile: userprofile;
  userSubscription: usersubscription;
  selectedSubscriptionid: string = '';
  userPayment: userpayment;
  userquestions: userquestions[];
  questionspdfArray: questionpdfarray[];
  date = new Date();
  enablePaymentStep: boolean = true;
  pdfMake: any;

  //Subscription Store Variables
  subscriptionloadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  //End Subscription Store Variables

  //Questions Store Variables
  questionLoadingIndicator$: Observable<boolean>;
  isQuestionsLoaded$: Observable<boolean>;
  //End Questions Store Variables



  @ViewChild(ProfileControlComponent, { static: true }) profileControl: ProfileControlComponent;
  @ViewChild(DisclaimerControlComponent, { static: true }) disclaimerControl: DisclaimerControlComponent;
  @ViewChild(SubscriptionComponent, { static: true }) subscriptionControl: SubscriptionComponent;
  @ViewChild(PaymentControlComponent, { static: true }) paymentControl: PaymentControlComponent;
  @ViewChild(SummaryControlComponent, { static: true }) summaryControl: SummaryControlComponent;
  @ViewChild(QuestionerControlComponent, { static: true }) questionControl: QuestionerControlComponent;
  @ViewChild(PdfComponent, { static: true }) pdfComponent: PdfComponent;
  @ViewChild(DisclaimerIControlComponent, { static: true }) disclaimerIControl: DisclaimerIControlComponent;

  isLinear: boolean = true;
  constructor(private datePipe: DatePipe,
    public accountService: AccountService,
    public emailService: EmailService,
    public authService: AuthService,
    private alertService: AlertService,
    private http: HttpClient,
    private stripeService: StripeService,
    private currencyPipe: CurrencyPipe,
    private pdfService: PdfService,
    private store$: Store<RootStoreState.State>
  ) {
    this.currentuserid = this.authService.currentUser.uid;
    this.currentuseremail = this.authService.currentUser.email;


  }

  ngOnInit(): void {

    // this.emailService.getSendinbBlueContact("gsatiesh2@hotmail.com").subscribe(data => { console.log(data) }, error => { let data = JSON.parse(error["friendlyMessage"]); console.log(data["code"]) });
    // let sendinblueattribute: sendinblueattributes = new sendinblueattributes("tt", "tt", 'asfdasdf');
    // let sbcontact: sendinbluecontact = new sendinbluecontact("gsatiesh@gmail.com", sendinblueattribute)
    // this.emailService.createSendinbBlueContact(sbcontact).subscribe(data => { console.log(data) }, error => { let data = JSON.parse(error["friendlyMessage"]); console.log(data["code"]) });


    //Questions Dispatch
    this.subscriptionloadingIndicator$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoaded);
    this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());
      }
    });
    //End Questions Dispatch


    //Questions Dispatch
    this.questionLoadingIndicator$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoading);
    this.isQuestionsLoaded$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoaded);
    this.isQuestionsLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new QuestionStoreActions.QuestionRequestAction());
      }
    });
    //End Questions Dispatch
  }

  public onStepperNext() {
    console.log(this.stepper.selectedIndex);
    switch (this.stepper.selectedIndex) {
      case 0:
        this.userDisclaimer = new userdisclaimer(this.disclaimerIControl.disclaimer.id,
          this.disclaimerIControl.readMeSlider,
          new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")), this.currentuserid);
        this.userquestions = this.disclaimerIControl.finalArray;
        this.questionspdfArray = this.disclaimerIControl.finalpdfArray;
        this.stepper.next();
        break;
      case 1:
        this.userProfile = this.profileControl.getnewuserProfileData();
        this.stepper.next();
        break;
      case 2:
        this.userSubscription = this.subscriptionControl.getnewuserSubscription();
        this.selectedSubscriptionid = this.userSubscription.subscriptions[0].subscriptionId;
        this.enablePaymentStep = true;
        let fullName = this.userProfile.firstName + ' ' + this.userProfile.lastName;
        this.paymentControl.firstname = this.userProfile.firstName;
        this.paymentControl.stripeTest.setValue({ name: fullName, amount: this.currencyPipe.transform(this.subscriptionControl.subscriptionamount) });
        this.paymentControl.amountval = this.subscriptionControl.subscriptionamount;
        this.paymentControl.amountvalcoupon = this.subscriptionControl.subscriptionamount;
        this.paymentControl.subscriptionname = this.subscriptionControl.subscriptionname;
        if (this.subscriptionControl.subscriptionamount == "0") { this.enablePaymentStep = false }
        this.stepper.next();
        break;
      case 3:
        this.pay();
        break;
    }
  }

  pay(): void {
    if (this.paymentControl.stripeTest.valid) {


      this.isPaymentProcessing = true;
      //   console.log(this.paymentControl.amountvalcoupon);
      let amount = Number(this.paymentControl.amountvalcoupon.toString().replace(/[^0-9-\.]+/g, ""));

      this.createPaymentIntent(amount)
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.paymentControl.card.element,
                billing_details: {
                  name: this.paymentControl.stripeTest.get('name').value,
                  email: this.currentuseremail
                },
              },
            })
          )
        )
        .subscribe((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            this.alertService.showMessage('', result.error.message, MessageSeverity.error)
            this.isPaymentProcessing = false;
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {

              this.paymentControl.paymentReferenceId = result.paymentIntent.id;
              this.paymentControl.amountnumber = amount;
              this.paymentControl.subscriptionId = this.userSubscription.subscriptions[0].subscriptionId;
              this.userPayment = this.paymentControl.getnewuserPayment();
              let memberId = this.getMemberId(this.userProfile.firstName.substring(0, 1), this.userProfile.lastName.substring(0, 1));
              // new user
              let user: newuser = new newuser(this.authService.currentUser.uid, this.currentuseremail, null, true, this.userProfile.firstName + " " + this.userProfile.lastName, memberId, false, this.authService.currentUser.uid, new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")));
              // new user role
              let userrole: userroles = new userroles('Subscriber', new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")), this.currentuserid);
              // subscription
              let userSubscription: subscriptions[] = [];
              userSubscription.push(this.userSubscription.subscriptions[0]);
              //payment info
              let userpayments: userpayment[] = [];
              userpayments.push(this.userPayment);

              //calling the service
              this.accountService.newUserProfile(user, this.userProfile, userrole, this.userDisclaimer, userSubscription, userpayments, this.userquestions);

              // calling the sendinblue service to create the contact
              let sendinblueattribute: sendinblueattributes = new sendinblueattributes(this.userProfile.firstName,
                this.userProfile.lastName, this.userProfile.mobileNumber,
                this.userProfile.city, this.userProfile.state, this.userProfile.country, this.userProfile.address, this.userProfile.postalZip,
                this.userProfile.address + ' ' + this.userProfile.city + ' ' + this.userProfile.state + ' ' + this.userProfile.postalZip + ' ' + this.userProfile.country);
              let lstId: Array<number> = new Array<number>();
              lstId.push(env.sendinBlueListId);
              let sendinbluecont: sendinbluecontact = new sendinbluecontact(user.email, sendinblueattribute, lstId);
              this.emailService.createSendinbBlueContact(sendinbluecont).subscribe(data => {
                this.sendWelcomeEmail(user.email, this.subscriptionControl.subscriptionname, this.subscriptionControl.subscriptionamount, this.userProfile.firstName, this.userProfile.lastName);
                //console.log(data)
              }, error => {
                let data = JSON.parse(error["friendlyMessage"]);
                switch (data["code"]) {
                  case "duplicate_parameter":
                    this.sendWelcomeEmail(user.email, this.subscriptionControl.subscriptionname, this.subscriptionControl.subscriptionamount, this.userProfile.firstName, this.userProfile.lastName);
                    break;
                  default:
                }
              });
              //this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
              this.gotoSummary(result.paymentIntent.id);
            }
          }
        });
    } else {
      console.log(this.paymentControl.stripeTest);
    }
  }

  async sendWelcomeEmail(email: string, subscriptionname: string, subscriptionamount: string, firstName: string, lastName: string) {

    var base64data: any;
    const documentDefinition = this.getDocumentDefinition();
    await this.loadPdfMaker();
    const pdfDocGenerator = await this.pdfMake.createPdf(documentDefinition);
    await pdfDocGenerator.getBase64((data) => {
      let welcomeTemplate: sendinblueWelcomeMail = new sendinblueWelcomeMail();
      welcomeTemplate.sender = new sendinbluetoaddress("noreply@urbanhood.org", "Custome Support - Urbanhood");
      let toArray: sendinbluetoaddress[] = [];
      toArray.push(new sendinbluetoaddress(email, firstName + ' ' + lastName));
      welcomeTemplate.to = toArray;
      let attachmentArray: sendinblueattachment[] = [];
      attachmentArray.push(new sendinblueattachment(data, "termsandconditions.pdf"));
      welcomeTemplate.attachment = attachmentArray;
      welcomeTemplate.templateId = env.welcometemplateId;
      let purchase: Purchase[] = [];
      purchase.push(new Purchase(subscriptionname, subscriptionamount));
      let params: paramsvalues = new paramsvalues(purchase);
      welcomeTemplate.params = params;
      this.emailService.sendWelcomeEmail(welcomeTemplate).subscribe(data => {
        console.log(data);
      }, error => { console.log(error); })
    });



    //const documentDefinition = this.getDocumentDefinition();
    //await this.pdfService.generateBase64Pdf(documentDefinition).then(function (val) {
    //  console.log("here" + val);
    //  let welcomeTemplate: sendinblueWelcomeMail = new sendinblueWelcomeMail();
    //  welcomeTemplate.sender = "gsatiesh@gmail.com";
    //  let toArray: sendinbluetoaddress[] = [];
    //  toArray.push(new sendinbluetoaddress(email, firstName + ' ' + lastName));
    //  welcomeTemplate.to = toArray;
    //  welcomeTemplate.templateId = 1;
    //  let purchase: Purchase[] = [];
    //  purchase.push(new Purchase(subscriptionname, subscriptionname));
    //  let params: paramsvalues = new paramsvalues(purchase);
    //  welcomeTemplate.params = params;
    //  this.emailService.sendWelcomeEmail(welcomeTemplate).subscribe(data => {
    //    console.log(data);
    //  }, error => { console.log(error); })
    //});
  }

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + env.stripeSecretApi //sk_test_51HN7MiHZ4XNG0JRpnv9s4WBRWz5EblyHAQbjANtTHhoLt8hdqtDvsDb9yq6F91lE8Cpi6Os0C4coAUL8hdsGFa4Q00fCUIx62k'
        })

    };
    const params = new HttpParams()
      .set('amount', (amount * 100).toString())
      .set('currency', 'usd')
      .set('payment_method_types[]', 'card')
      .set('receipt_email', this.authService.currentUser.email);
    return this.http.post<PaymentIntent>(`${env.apiUrl}/v1/payment_intents`, params.toString(), httpOptions);
  }

  async freeSubscriptionSetup() {

    let memberId = this.getMemberId(this.userProfile.firstName.substring(0, 1), this.userProfile.lastName.substring(0, 1));

    // new user
    let user: newuser = new newuser(this.authService.currentUser.uid, this.currentuseremail, null, true, this.userProfile.firstName + " " + this.userProfile.lastName, memberId, false, this.authService.currentUser.uid, new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")));
    // new user role
    let userrole: userroles = new userroles('Subscriber', new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")), this.currentuserid);
    // subscription
    let userSubscription: subscriptions[] = [];
    userSubscription.push(new subscriptions(this.subscriptionControl.subscriptionId, true, null, new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")), this.currentuserid));
    //payment info
    let userpayments: userpayment[] = [];
    userpayments.push(new userpayment(this.subscriptionControl.subscriptionId, "subscription", "Not Applicable", 0, '', 0, new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")), this.currentuserid));
    //calling the service
    await this.accountService.newUserProfile(user, this.userProfile, userrole, this.userDisclaimer, userSubscription, userpayments, this.userquestions);

    // calling the sendinblue service to create the contact
    let sendinblueattribute: sendinblueattributes = new sendinblueattributes(this.userProfile.firstName,
      this.userProfile.lastName,this.userProfile.mobileNumber,
      this.userProfile.city, this.userProfile.state, this.userProfile.country, this.userProfile.address, this.userProfile.postalZip,
      this.userProfile.address + ' ' + this.userProfile.city + ' ' + this.userProfile.state + ' ' + this.userProfile.postalZip + ' ' + this.userProfile.country);
    let lstId: Array<number> = new Array<number>();
    lstId.push(env.sendinBlueListId);
    let sendinbluecont: sendinbluecontact = new sendinbluecontact(user.email, sendinblueattribute, lstId);
    this.emailService.createSendinbBlueContact(sendinbluecont).subscribe(data => {
      this.sendWelcomeEmail(user.email, this.subscriptionControl.subscriptionname, this.subscriptionControl.subscriptionamount, this.userProfile.firstName, this.userProfile.lastName);
      //console.log(data)
    }, error => {
      let data = JSON.parse(error["friendlyMessage"]);
      switch (data["code"]) {
        case "duplicate_parameter":
          this.sendWelcomeEmail(user.email, this.subscriptionControl.subscriptionname, this.subscriptionControl.subscriptionamount, this.userProfile.firstName, this.userProfile.lastName);
          break;
        default:
      }
    });

    this.gotoSummary('');
  }



  gotoSummary(id: string) {
    this.stepper.selected.completed = true;
    this.summaryControl.enablePaymentStep = this.enablePaymentStep;
    this.summaryControl.referenceid = id;
    this.summaryControl.firstname = this.profileControl.userProfileForm.get('firstName').value;
    this.summaryControl.emailaddress = this.authService.currentUser.email;
    this.stepper.next();
  }

  async generateBase64Pdf() {
    var base64Data: any;
    const documentDefinition = this.getDocumentDefinition();
    await this.pdfService.generateBase64Pdf(documentDefinition).then(function (val) {
      base64Data = val;
    });
    console.log(base64Data);
    return base64Data;
  }
  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': this.pdfService.generatePdf(documentDefinition); break;
    }
  }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  getDocumentDefinition() {
    //var html = htmlToPdfmake(this.disclaimerTxt);
    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: 'AGREEMENT FOR\nURBANHOOD SERVICES',
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Sections 1: Usage-Based Services/Nonprofessional Subscriber Status',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        }
        ,
        {
          text: this.disclaimerIControl.disclaimer.section1["para"][0],
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Sections 2: Trems and Conditions',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        {
          text: this.disclaimerIControl.disclaimer.section2["para"][0],
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: this.disclaimerIControl.disclaimer.section2["para"][1],
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: this.disclaimerIControl.disclaimer.section2["para"][2],
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: "Accepted Terms and Condition: " + this.disclaimerIControl.readMeSlider ? "Yes" : "No",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Sections 3: Questions',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        this.getQuestions(this.questionspdfArray),
        {
          text: '\nSections 4: Certification',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        {
          text: this.disclaimerIControl.disclaimer.section3["para"][0],
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: this.disclaimerIControl.readMeSlider ? "I Agree" : "I Disagree",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        }
        //,
        //{
        //  text: 'AGREEMENT FOR\nURBANHOOD SALES',
        //  fontSize: 20,
        //  alignment: 'center',
        //  pageBreak: 'before',
        //  margin: [0, 0, 0, 20]
        //},
      ]
    };
  }

  getQuestions(questionArray: questionpdfarray[]) {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [{
            text: 'Question',
            style: 'tableHeader'
          },
          {
            text: 'Result',
            style: 'tableHeader'
          },
          ],
          ...questionArray.map(ed => {
            return [ed.question, ed.result];
          })
        ]
      }
    };
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      //this.logo = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  getMemberId(first: string, last: string): string {
    let returnValue = first + last + Utilities.getRandomInt(6);
    var userData$: Observable<User[]>;
    userData$ = this.accountService.getuserbymemberid(returnValue);
    console.log(returnValue);
    console.log(userData$);
    userData$.subscribe(data => {
      if (data.length > 0) {
        if (data[0].memberId == returnValue) {
          this.getMemberId(first, last);
        }
      }
    })
    return returnValue;
  }
}
