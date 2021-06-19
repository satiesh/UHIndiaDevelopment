// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges } from '@angular/core';
import {  CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject} from 'rxjs';

import {
  AlertService, MessageSeverity,
  AppTranslationService, AuthService, AppService, ValidationService, AccountService
} from '@app/services';

import { Roles, SixDigitData } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { MatSelectChange } from '@angular/material/select';
import { FormatPhonePipe } from '@app/pipes/format.phone';
//import { User } from 'firebase';

@Component({
  selector: 'app-user-profile-editor',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserSubscriptionEditorComponent implements OnChanges, OnDestroy {
  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewUser  = false;
  public isSaving = false;
  private onUserSaved = new Subject<User>();
  isMobileValid = false;
  isMobileVerified = false;
  @Input() user: User;
  @Input() isEditMode = false;

  userForm: FormGroup;
  userSaved$ = this.onUserSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get address() {
    return this.userForm.get('address');
  }
  get address1() {
    return this.userForm.get('address1');
  }
  get city() {
    return this.userForm.get('city');
  }
  get state() {
    return this.userForm.get('state');
  }
  get postalZip() {
    return this.userForm.get('postalZip');
  }
  get country() {
    return this.userForm.get('country');
  }
  get mobileNumber() {
    return this.userForm.get('mobileNumber');
  }
  //get verifycode() {
  //  return this.verifyCodeForm.get('verifycode');
  //}

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
  }

  ngOnChanges() {
    if (this.user) {
      this.isNewUser = false;
    } else {
      this.isNewUser = true;
      this.user = null;
    }

    this.resetForm();
  }

  ngOnDestroy() {
  }

  public setUser(user?: User) {
    this.user = user;
    this.ngOnChanges();
  }

  private buildForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      address1: '',
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalZip: ['', Validators.required],
      country: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.maxLength(20), ValidationService.mobileValidator]]
    });
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.user) {
      this.isNewUser = true;
      this.user = new User();
    }

    this.userForm.reset({
      firstName: this.user.userprofile.firstName || '',
      lastName: this.user.userprofile.lastName || '',
      address: this.user.userprofile.address || '',
      address1: this.user.userprofile.address1 || '',
      city: this.user.userprofile.city || '',
      state: this.user.userprofile.state || '',
      postalzip: this.user.userprofile.postalZip || '',
      country: this.user.userprofile.country || '',
      mobileNumber: this.formatPhone(this.user.userprofile.mobileNumber) || ''
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

    if (!this.userForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const editedRole = this.getEditedRole();
    console.log(editedRole);
    if (this.isNewUser) {
      //this.store$.dispatch(new RolesStoreActions.AddRoleRequestAction(editedRole))
    } else {
      //this.store$.dispatch(new RolesStoreActions.UpdateRoleRequestAction(editedRole))
    }
    this.onUserSaved.next(this.user);
    this.alertService.stopLoadingMessage();
  }

  private getEditedRole(): Roles {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    const formModel = this.userForm.value;
    let roleedit: Roles = new Roles();
    //roleedit.id = this.isNewUser ? this.appService.getNewDocId() : this.role.id,
    //  roleedit.RoleName = formModel.RoleName,
    //  roleedit.RoleDescription = formModel.RoleDescription,
    //  roleedit.IsActive = formModel.IsActive,
    //  roleedit.CreatedOn = this.isNewUser ? new Date(now_utc) : this.role.CreatedOn,
    //  roleedit.CreatedBy = this.isNewUser ? this.authService.currentUser.uid : this.role.CreatedBy
    return roleedit;
  }

  public cancel() {
    this.resetForm();
    this.isEditMode = false;

    this.alertService.resetStickyMessage();
  }


  private saveCompleted(user?: User) {
    if (user) {
      //this.raiseEventIfRolesModified(this.subscription, subscription);
      this.user = user;
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

  //private raiseEventIfRolesModified(currentUser: User, editedUser: User) {
  //  const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) === -1);
  //  const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) === -1);

  //  const modifiedRoles = rolesAdded.concat(rolesRemoved);

  //  if (modifiedRoles.length) {
  //    setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
  //  }
  //}

  sendVerificationCode(event) {
    if (this.userForm.controls['mobileNumber'].valid) {
      if (this.user.userprofile.mobileNumber != this.userForm.controls['mobileNumber'].value) {
        this.user.userprofile.mobileNumber = this.userForm.controls['mobileNumber'].value;
        this.isMobileValid = false;
        this.isMobileVerified = false;
        // this.verifyCodeForm.setValue({ verifycode: '' });

        this.accountService.sendVerificationCode(new SixDigitData(this.userForm.controls['mobileNumber'].value.replace(/ /g, ''), '')).subscribe(
          data => { this.enableVerificationSection(data); },
          error => this.alertService.showMessage("Error Sending Verification Code. Please check the provided mobile number."));
      }
    }
  }
  private enableVerificationSection(data: any) {
    if (data.sid && data.status === 'pending') {
      this.isMobileValid = true;
    }
  }
  formatPhone(phoneNumber: string) {
    return new FormatPhonePipe().transform(
      phoneNumber,
      "mobile"
    ).FormattedPhone
  }

  mobileChange(event: MatSelectChange) {
    this.userForm.controls["mobileNumber"].setValue(
      new FormatPhonePipe().transform(
        this.userForm.controls["mobileNumber"].value,
        "mobile"
      ).FormattedPhone
    );
  }
}
