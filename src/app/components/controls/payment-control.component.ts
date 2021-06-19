import { Component, OnInit, ViewChild, ɵConsole, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment as env } from '@environments/environment';

import { StripeService, StripeCardNumberComponent, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { userpayment } from 'src/app/models/userpayment';
import { AppService, AlertService, MessageSeverity } from '../../services';
import { MatTableDataSource } from '@angular/material/table';
import { appliedcouponsdisplay, coupons } from '../../models';


@Component({
  selector: 'app-payment-token',
  templateUrl: './payment-control.component.html',
  styleUrls: ['./payment-control.component.scss']

})


export class PaymentControlComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  displayedColumns = ['couponcode', 'amount', 'actions'];
  dataSource: MatTableDataSource<appliedcouponsdisplay>;
  @Input() selectedSubscription;
  amountval: string;
  amountvalcoupon: string;
  amountnumber: number;
  firstname: string;
  subscriptionname: string;
  subscriptionId: string;
  paymentReferenceId: string
  appliedCodes: appliedcouponsdisplay[] = [];
  couponProcessed: boolean = false;
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
  couponDetails: FormGroup;
  get couponcode() {
    return this.couponDetails.get('couponcode');
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private alertService: AlertService,
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) { this.dataSource = new MatTableDataSource(); }

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/\d+/)]]
    })
    this.buildForm();
  }

  private buildForm() {
    this.couponDetails = this.fb.group({
      couponcode: ''
    });
  }

  clearCoupon() {

  }

  applyCoupon() {
    this.couponProcessed = false;
    this.appliedCodes = [];
    var frmCouponCode = this.couponDetails.get('couponcode').value;
    if (!frmCouponCode) {
      this.alertService.showMessage("ERROR", "Please enter a valid coupon code before applying.", MessageSeverity.error);
    }
    else {
      //let getCouponValue = this.appService.calculateCoupon(frmCouponCode, Number(this.amountval));
      let getCouponValue = this.appService.calculateCoupon(frmCouponCode);
      let namount: number = 0;

      var query = getCouponValue.subscribe(data => {
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            let coupon = data[i];
            if (coupon["isactive"] == true) {

              if (coupon["discounteditem"] == "All") {
                this.updateCoupon(coupon);
                break;
              }
              else {
                var disctitems: string[] = [];
                disctitems = coupon["discounteditem"].split(',');
                if (disctitems.includes(this.selectedSubscription)) {
                  this.updateCoupon(coupon);
                  break;
                }
                else {
                  this.alertService.showMessage("ERROR", "Either coupon code is expired or it is invalid. Please verify and apply the correct one.", MessageSeverity.error);
                  break;
                }

              }
            }
            else {
              this.alertService.showMessage("ERROR", "Either coupon code is expired or it is invalid. Please verify and apply the correct one.", MessageSeverity.error);
              break;
            }
          }
        }
        else {
          this.alertService.showMessage("ERROR", "Either coupon code is expired or it is invalid. Please verify and apply the correct one.", MessageSeverity.error);
        }
      });
    }
  }

  updateCoupon(coupon: coupons[]) {
    var frmCouponCode = this.couponDetails.get('couponcode').value;
    let namount: number = 0;
    if (coupon["type"] === "AMT") {
      namount = Number(this.amountval) - coupon["value"];
      this.amountvalcoupon = namount.toString();
      this.couponProcessed = true;
      let nappliedcouponsdisplay: appliedcouponsdisplay = new appliedcouponsdisplay();
      nappliedcouponsdisplay.couponcode = frmCouponCode;
      nappliedcouponsdisplay.amount = coupon["value"];
      this.appliedCodes.push(nappliedcouponsdisplay);
      this.dataSource.data = this.appliedCodes;
      this.couponDetails.get('couponcode').setValue('');
    }
    else {
      if (coupon["type"] === "PER") {
        namount = Number(this.amountval) - (Number(this.amountval) * coupon["value"] / 100);
        this.amountvalcoupon = namount.toString();
        this.couponProcessed = true;
        let nappliedcouponsdisplay: appliedcouponsdisplay = new appliedcouponsdisplay();
        nappliedcouponsdisplay.couponcode = frmCouponCode;
        nappliedcouponsdisplay.amount = (Number(this.amountval) * coupon["value"] / 100);
        this.appliedCodes.push(nappliedcouponsdisplay);
        this.dataSource.data = this.appliedCodes;
        this.dataSource.data = this.appliedCodes;
        this.couponDetails.get('couponcode').setValue('');
      }
    }
  }

  removeCoupon() {
    this.appliedCodes = [];
    this.amountvalcoupon = this.amountval;
    this.couponProcessed = false;
  }

  getnewuserPayment() {
    let couponcode: string = ''
    let couponamt: number = 0;
    couponcode = this.appliedCodes.length > 0 ? this.appliedCodes[0].couponcode : '';
    couponamt = this.appliedCodes.length > 0 ? this.appliedCodes[0].amount : 0;
    var date = new Date();
    return new userpayment(this.subscriptionId,
      "subscription",
      this.paymentReferenceId,
      this.amountnumber,
      couponcode,
      couponamt,
      new Date(this.datePipe.transform(date, "MM/dd/yyyy")),
      this.authService.currentUser.uid)
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
    if (this.stripeTest.valid) {
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
            //console.log(result.error);
            //console.log(result.error.message);
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
