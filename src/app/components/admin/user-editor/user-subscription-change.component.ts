import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { usersubscriptiondisplay, subscriptions, usersubscription, userpayment, userroles } from '../../../models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreActions, CurrentUsersStoreSelectors, UsersStoreSelectors, UsersStoreActions } from '../../../store';
import { User } from '../../../models/user';
import { Utilities, AuthService, AlertService, MessageSeverity } from '../../../services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { SubscriptionComponent, PaymentControlComponent, SummaryControlComponent } from '../../controls';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { environment as env } from '@environments/environment';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { newuser } from '../../../models/newuser';
import { PaymentIntent } from '@stripe/stripe-js';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-subscription-change',
  templateUrl: './user-subscription-change.component.html',
  styleUrls: ['./user-subscription-change.component.scss']
})
export class UserSubscriptionChangeComponent {
  @ViewChild(SubscriptionComponent, { static: true }) subscriptionControl: SubscriptionComponent;
  @ViewChild(PaymentControlComponent, { static: true }) paymentControl: PaymentControlComponent;
  @ViewChild(SummaryControlComponent, { static: true }) summaryControl: SummaryControlComponent;
  @ViewChild(MatHorizontalStepper)


  stepper: MatHorizontalStepper;
  isLinear: boolean = true;

  isFreeSubscription: boolean = false;
  isCurrentUserLoading$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;
  isListUserLoaded$: Observable<boolean>;

  isSubscriptionUpdated: boolean = false;
  currentSelectedId: string = '';
  userSubscription: usersubscription;
  userPayment: userpayment;
  enablePaymentStep: boolean = true;
  isPaymentProcessing: boolean;
  date = new Date();
  updateFromUserList: boolean;
  get subscriptionName(): any {
    return this.data.currentSubscription ? { name: this.data.currentSubscription.description } : null;
  }



  constructor(
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<UserSubscriptionChangeComponent>,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private stripeService: StripeService,
    private alertService: AlertService,
    private http: HttpClient,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { currentSubscription: usersubscriptiondisplay, updateFromUserList: boolean, user: User },
    private store$: Store<RootStoreState.State>
  ) {
    this.currentSelectedId = this.data.currentSubscription.id;
    if (this.data.currentSubscription.id == "WNiJ2h1kpYD83EzTpdaM") {
      this.isFreeSubscription = true;
    }
    this.updateFromUserList = this.data.updateFromUserList;
  }
  ngOnInit() {
    if (!this.updateFromUserList) {
      this.isCurrentUserLoading$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
      this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));
    }
    else {
      if (this.data.user) {
        this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
        this.selectCurrentUser$ = this.store$.select(UsersStoreSelectors.selectUserById(this.data.user.uid));
      }
    }
  }

  public onStepperNext() {
    switch (this.stepper.selectedIndex) {
      case 0:
        this.userSubscription = this.subscriptionControl.getnewuserSubscription();
        this.enablePaymentStep = true;
        let fullName = this.data.user.userprofile.firstName + ' ' + this.data.user.userprofile.lastName;
        this.paymentControl.firstname = this.data.user.userprofile.firstName;
        this.paymentControl.stripeTest.setValue({ name: fullName, amount: this.currencyPipe.transform(this.subscriptionControl.subscriptionamount) });
        this.paymentControl.amountval = this.subscriptionControl.subscriptionamount;
        this.paymentControl.subscriptionname = this.subscriptionControl.subscriptionname;
        this.stepper.next();
        break;
      case 1:
        this.pay();
        break;
    }
  }

  pay(): void {
    if (this.paymentControl.stripeTest.valid) {


      this.isPaymentProcessing = true;
      let amount = Number(this.paymentControl.stripeTest.get('amount').value.replace(/[^0-9-\.]+/g, ""));
      this.createPaymentIntent(amount)
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.paymentControl.card.element,
                billing_details: {
                  name: this.paymentControl.stripeTest.get('name').value,
                  email: this.data.user.email
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

              let nUser: User = Utilities.userDTO(this.data.user,this.authService.currentUser.uid);
              let asubscription: subscriptions = nUser.usersubscription.subscriptions.filter(a => a.isActive == true)[0];
              asubscription.isActive = false;
              let nsubsctiption: subscriptions = this.userSubscription.subscriptions[0];
              nUser.usersubscription.subscriptions.push(nsubsctiption);
              nUser.userpayment.push(this.userPayment);

              if (!this.updateFromUserList) {
                this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersSubscriptionRequestAction(nUser));
              }
              else {
                this.store$.dispatch(new UsersStoreActions.UpdateUsersSubscriptionRequestAction(nUser));
              }
              this.selectCurrentUser$.subscribe(result => {
                if (result) {
                  let asubscription: subscriptions = result.usersubscription.subscriptions.filter(a => a.isActive == true)[0];
                  if (asubscription.subscriptionId == nsubsctiption.subscriptionId) {
                    this.isSubscriptionUpdated = true;
                    this.isPaymentProcessing = false;
                    this.gotoSummary(this.paymentControl.paymentReferenceId);
                  }
                }
              });
            }
          }
        });
    } else {
      console.log(this.paymentControl.stripeTest);
    }
  }

  gotoSummary(id: string) {
    this.stepper.selected.completed = true;
    this.summaryControl.enablePaymentStep = this.enablePaymentStep;
    this.summaryControl.referenceid = id;
    this.summaryControl.isNewSetup = false;
    this.summaryControl.isExistingUser = this.updateFromUserList ? true : false;
    this.summaryControl.firstname = this.data.user.userprofile.firstName;
    this.summaryControl.emailaddress = this.data.user.email;
    this.stepper.next();
  }


  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer sk_test_51HN7MiHZ4XNG0JRpnv9s4WBRWz5EblyHAQbjANtTHhoLt8hdqtDvsDb9yq6F91lE8Cpi6Os0C4coAUL8hdsGFa4Q00fCUIx62k'
        })

    };
    const params = new HttpParams()
      .set('amount', (amount * 100).toString())
      .set('currency', 'usd')
      .set('payment_method_types[]', 'card')
      .set('receipt_email', this.authService.currentUser.email);
    return this.http.post<PaymentIntent>(`${env.apiUrl}/v1/payment_intents`, params.toString(), httpOptions);
  }

  cancelSubscription(): void {

    let nUser: User = Utilities.userDTO(this.data.user, this.authService.currentUser.uid);
    let asubscription: subscriptions = nUser.usersubscription.subscriptions.filter(a => a.isActive == true)[0];
    asubscription.isActive = false;
    let nsubsctiption: subscriptions = new subscriptions("WNiJ2h1kpYD83EzTpdaM", true, Utilities.getRenewalDate("free"),
      new Date(Utilities.getCurrentDateUTC()), this.authService.currentUser.uid)
    nUser.usersubscription.subscriptions.push(nsubsctiption);
    //console.log(nUser);
    this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersSubscriptionRequestAction(nUser));

    this.selectCurrentUser$.subscribe(result => {
      if (result) {
        let asubscription: subscriptions = result[0].usersubscription.subscriptions.filter(a => a.isActive == true)[0];
        if (asubscription.subscriptionId == "WNiJ2h1kpYD83EzTpdaM") {
          this.isSubscriptionUpdated = true;
        }
      }
    });
  }
  logout(): void {
    this.dialogRef.close(null);
    this.authService.SignOut();
    this.authService.redirectLogoutUser();
  }
  cancel(): void {
    if (this.isSubscriptionUpdated && !this.updateFromUserList) {
      this.dialogRef.close(null);
      this.logout();
    }
    else {
      this.dialogRef.close(null);
    }
  }
}
