// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, AfterViewInit, Inject, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Courses } from '@app/models';
import { CoursePaymentComponent } from '../course-payment/course-payment.component';
import { AuthService } from '../../../services';
import { CurrencyPipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { PaymentIntent } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { StripeService } from 'ngx-stripe';
import { environment as env } from '@environments/environment';
import { AlertService, MessageSeverity, AccountService } from '@app/services';


@Component({
  selector: 'app-register-course-dialog',
  templateUrl: './register-course-dialog.component.html',
  styleUrls: ['./register-course-dialog.component.scss']
})


export class RegisterCourseDialogComponent implements AfterViewInit {
  @ViewChild(CoursePaymentComponent, { static: true })
  editCourse: CoursePaymentComponent;
  @Input() course: Courses = new Courses();
  get courseName(): any { return this.data.course ? { name: this.data.course.Name } : null; }
  isPaymentProcessing: boolean = false;
  enablePaymentStep: boolean = true;
  referenceId: string = '';
  firstname: string = '';
  constructor(
    public dialogRef: MatDialogRef<RegisterCourseDialogComponent>,
    private authService: AuthService,
    private http: HttpClient,
     private stripeService: StripeService,
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe,
   @Inject(MAT_DIALOG_DATA) public data: { course: Courses }) {
    console.log('From Register', data);
    this.firstname = this.authService.currentUser.displayName;
    this.enablePaymentStep = true;
  }

  ngAfterViewInit() {
    //this.editCourse.courseSaved$.subscribe(user => this.dialogRef.close(user));
  }
  payCourse(): void {
    this.editCourse.stripeTest.setValue({ name: this.firstname, amount: Number(this.currencyPipe.transform(this.data.course.Price).toString().replace(/[^0-9-\.]+/g, ""))});

    if (this.editCourse.stripeTest.valid) {
      this.isPaymentProcessing = true;
      this.pay();
    }
  }
  cancel(): void {
    this.dialogRef.close(null);
  }

  pay(): void {

    if (this.editCourse.stripeTest.valid) {
      this.createPaymentIntent(this.editCourse.stripeTest.get('amount').value)
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.editCourse.card.element,
                billing_details: {
                  name: this.editCourse.stripeTest.get('name').value,
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
            this.alertService.showMessage('', result.error.message, MessageSeverity.error)
            this.isPaymentProcessing = false;
            this.enablePaymentStep = true;
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              this.referenceId= result.paymentIntent.id;
              // Show a success message to your customer
              this.isPaymentProcessing = false;
              this.enablePaymentStep = false;
            }
          }
        });
    } else {
      console.log(this.editCourse.stripeTest);
    }
  }

  createPaymentIntent(amountn: number): Observable<PaymentIntent> {
    let httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization': 'Bearer sk_test_51HN7MiHZ4XNG0JRpnv9s4WBRWz5EblyHAQbjANtTHhoLt8hdqtDvsDb9yq6F91lE8Cpi6Os0C4coAUL8hdsGFa4Q00fCUIx62k'
          'Authorization': 'Bearer ' + env.stripeSecretApi
        })

    };
    const params = new HttpParams()
      .set('amount', amountn.toString())
      .set('currency', 'usd');
    return this.http.post<PaymentIntent>(`${env.apiUrl}/v1/payment_intents`, params.toString(), httpOptions);
  }
}
