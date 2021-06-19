// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import {
  AccountService, AlertService,
  MessageSeverity, AppTranslationService, AuthService, AppService
} from '@app/services';

import { ServiceSubscription } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, SubscriptionStoreSelectors, SubscriptionStoreActions } from '@app/store';

@Component({
  selector: 'app-subscription-editor',
  templateUrl: './subscription-editor.component.html',
  styleUrls: ['./subscription-editor.component.scss']
})
export class SubscriptionEditorComponent implements OnChanges, OnDestroy {
  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewSubscription = false;
  public isSaving = false;
  private onSubscriptionSaved = new Subject<ServiceSubscription>();
  formattedAmount;
  @Input() subscription: ServiceSubscription = new ServiceSubscription();
  @Input() isEditMode = false;

  subscriptionForm: FormGroup;
  subscriptionSaved$ = this.onSubscriptionSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  postedfor: string;
  postedGroups: string[] = ['SILVER MEMBERS', 'GOLD MEMBERS', 'PLATINUM MEMBERS']

  get Name() {
    return this.subscriptionForm.get('Name');
  }

  get Description() {
    return this.subscriptionForm.get('Description');
  }

  get IsActive() {
    return this.subscriptionForm.get('IsActive');
  }

  get GroupName() {
    return this.subscriptionForm.get('GroupName');
  }
  get Price() {
    return this.subscriptionForm.get('Price');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
  }

  ngOnChanges() {
    if (this.subscription) {
      this.isNewSubscription = false;
    } else {
      this.isNewSubscription = true;
      this.subscription = new ServiceSubscription();
    }

    this.resetForm();
  }

  ngOnDestroy() {
  }

  public setUser(subscription?: ServiceSubscription) {
    this.subscription = subscription;
    this.ngOnChanges();
  }

  private buildForm() {
    this.subscriptionForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: '',
      IsActive: [true, [Validators.required]],
      GroupName: ['', Validators.required],
      Price: ['', Validators.required]
    });
    this.IsActive.setValue(true);
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.subscription) {
      this.isNewSubscription = true;
      this.subscription = new ServiceSubscription();
    }

    this.subscriptionForm.reset({
      Name: this.subscription.Name || '',
      Description: this.subscription.Description || '',
      GroupName: this.subscription.GroupName || '',
      IsActive: this.subscription.IsActive || '',
      Price: this.currencyPipe.transform(this.subscription.Price, '$') || []
    });
  }

  public beginEdit() {
    this.isEditMode = true;
  }

  public save() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.subscriptionForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const editedSubscription = this.getEditedSubscription();

    if (this.isNewSubscription) {
      this.store$.dispatch(new SubscriptionStoreActions.AddSubscriptionRequestAction(editedSubscription))
    } else {
      this.store$.dispatch(new SubscriptionStoreActions.UpdateSubscriptionRequestAction(editedSubscription))
    }
    this.onSubscriptionSaved.next(this.subscription);
    this.alertService.stopLoadingMessage();
  }

  private getEditedSubscription(): ServiceSubscription {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const formModel = this.subscriptionForm.value;
    let subscriptionedit: ServiceSubscription = new ServiceSubscription();
    subscriptionedit.id = this.isNewSubscription ? this.appService.getNewDocId() : this.subscription.id,
      subscriptionedit.Name = formModel.Name,
      subscriptionedit.Description = formModel.Description,
      subscriptionedit.GroupName = formModel.GroupName,
      subscriptionedit.Price = Number(formModel.Price.replace(/[^0-9\.]+/g, "")),
      subscriptionedit.IsActive = formModel.IsActive,
      subscriptionedit.CreatedOn = this.isNewSubscription ? new Date(now_utc) : this.subscription.CreatedOn,
      subscriptionedit.CreatedBy = this.isNewSubscription ? this.authService.currentUser.uid : this.subscription.CreatedBy
    return subscriptionedit;
  }


  transformAmount(element) {
    this.formattedAmount = this.currencyPipe.transform(this.Price.value, '$');
    element.target.value = this.formattedAmount;
  }


  public cancel() {
    this.resetForm();
    this.isEditMode = false;

    this.alertService.resetStickyMessage();
  }


  private saveCompleted(subscription?: ServiceSubscription) {
    if (subscription) {
      //this.raiseEventIfRolesModified(this.subscription, subscription);
      this.subscription = subscription;
    }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    this.resetForm(true);

    //this.onUserSaved.next(this.user);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'One or more errors occured whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

}
