import { Component, OnInit, ViewChild, ɵConsole, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment as env } from '../../../../environments/environment'

import { StripeService, StripeCardNumberComponent, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { userpayment } from 'src/app/models/userpayment';
import { User } from '../../../models/user';
import { CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '../../../store/currentuser-data';
import { select, Store } from '@ngrx/store';
import { RootStoreState } from '../../../store';
import { Courses } from '../../../models';


@Component({
  selector: 'app-payment-course',
  templateUrl: './course-payment.component.html',
})

export class CoursePaymentComponent implements OnInit {
  @Input() course: Courses = new Courses();
  
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  amountval: string;
  amountnumber: number;
  @Input() sourceCourses: any;
  firstname: string;
  subscriptionname: string;
  subscriptionId: string;
  paymentReferenceId: string
  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User[]>;
  currentuser: User = new User();
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#000000',
        },
      },
    },
  };


  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService, private authService: AuthService,
    private datePipe: DatePipe,
    private store$: Store<RootStoreState.State>
  ) {
    console.log(this.authService.currentUser);
    this.firstname = this.authService.currentUser.displayName;

  }


  ngOnInit(): void {
    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);

    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    });

    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (result) {

        this.selectCurrentUser$.subscribe(doc => {
          if (doc) {
            this.currentuser = doc[0];
          }
        });
      }
    });


        this.stripeTest = this.fb.group({
          name: ['', [Validators.required]],
          amount: ['', [Validators.required, Validators.pattern(/\d+/)]],
        });
      }


      getnewuserPayment() {
        var date = new Date();
        return new userpayment(this.subscriptionId,"course", this.paymentReferenceId, this.amountnumber,'',0, new Date(this.datePipe.transform(date, "MM/dd/yyyy")), this.authService.currentUser.uid)

      }

      createToken(): void {
        const name = this.stripeTest.get('name').value;
        this.stripeService
          .createToken(this.card.element, { name })
          .subscribe((result) => {
            if (result.token) {
              // Use the token
              console.log(result.token.id);
            } else if (result.error) {
              // Error creating the token
              console.log(result.error.message);
            }
          });
      }

      pay(): void {
        if(this.stripeTest.valid) {
      this.createPaymentIntent(this.stripeTest.get('amount').value)
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.stripeTest.get('name').value,
                },
              },
            })
          )
        )
        .subscribe((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error);
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
            }
          }
        });
    } else {
      console.log(this.stripeTest);
    }
  }

  createPaymentIntent(amountn: number): Observable<PaymentIntent> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer sk_test_51HN7MiHZ4XNG0JRpnv9s4WBRWz5EblyHAQbjANtTHhoLt8hdqtDvsDb9yq6F91lE8Cpi6Os0C4coAUL8hdsGFa4Q00fCUIx62k'
        })

    };
    const params = new HttpParams()
      .set('amount', amountn.toString())
      .set('currency', 'usd');
    return this.http.post<PaymentIntent>(`${env.apiUrl}/v1/payment_intents`, params.toString(), httpOptions);
  }

}
