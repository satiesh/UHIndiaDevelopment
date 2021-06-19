// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, Inject, AfterViewInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store} from '@ngrx/store';
import { RootStoreState } from '@app/store';
import { Observable } from 'rxjs';
import { AccountService } from '@app/services';
import { User } from '@app/models/user';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ProfileControlComponent, SubscriptionComponent, PaymentControlComponent, SummaryControlComponent } from '@app/components/controls';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';


@Component({
  selector: 'app-user-new-dialog',
  templateUrl: 'user-new-dialog.component.html',
  styleUrls: ['user-new-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})

export class NewUserDialogComponent implements AfterViewInit {
  @ViewChild(MatHorizontalStepper)
  stepper: MatHorizontalStepper;
  isLinear: boolean = true;
  isPaymentProcessing: boolean = false;
  enablePaymentStep: boolean = true;
  collect$: Observable<any>;
  isEditMode: boolean = false;
  @ViewChild(ProfileControlComponent, { static: true }) profileControl: ProfileControlComponent;
  @ViewChild(SubscriptionComponent, { static: true }) subscriptionControl: SubscriptionComponent;
  @ViewChild(PaymentControlComponent, { static: true }) paymentControl: PaymentControlComponent;
  @ViewChild(SummaryControlComponent, { static: true }) summaryControl: SummaryControlComponent;


  constructor(
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User}, private store$: Store<RootStoreState.State>) {
  }

  public onStepperNext() {
    switch (this.stepper.selectedIndex) {

    }
  }
  async freeSubscriptionSetup() {
  }
  ngAfterViewInit() {
    //this.editRole.roleSaved$.subscribe(role => this.dialogRef.close(role));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
