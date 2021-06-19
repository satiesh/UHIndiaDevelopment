// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

import {
  AlertService, MessageSeverity, ValidationService, AccountService, Utilities, AuthService
} from '@app/services';

import { Roles, SixDigitData, userprofile } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreActions, CurrentUsersStoreSelectors, UsersStoreSelectors, UsersStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { MatSelectChange } from '@angular/material/select';
import { FormatPhonePipe } from '@app/pipes/format.phone';

@Component({
  selector: 'app-user-profile-editor',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileEditorComponent implements OnChanges, OnDestroy {
  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewUser = false;
  public isSaving = false;
  private onUserSaved = new Subject<User>();
  verifyCodeForm: FormGroup;
  isVerifyingCode: boolean = false;
  isResendingCode: boolean = false;
  isMobileValid = false;
  isMobileVerified = false;

  @Input() user: User;
  @Input() updateFromUserList: boolean;
  @Input() isEditMode : boolean;

  sendingCodeIndicator: boolean = false;

  isCurrentUserLoaded$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  userForm: FormGroup;
  userSaved$ = this.onUserSaved.asObservable();
  get email() {
    return this.userForm.get('email');
  }
  get memberid() {
    return this.userForm.get('memberid');
  }
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
  get verifycode() {
    return this.verifyCodeForm.get('verifycode');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
    this.buildverifycodeForm();
  }

  ngOnChanges() {
    if (!this.updateFromUserList) {
      this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    }
    else {
      this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    }
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
      email: [''],
      memberid: [''],
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
  private buildverifycodeForm() {
    this.verifyCodeForm = this.formBuilder.group({
      verifycode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }
  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.user) {
      this.isNewUser = true;
      this.user = Utilities.newUserDTO();
    }

    this.userForm.reset({
      email: this.user.email || '',
      memberid: this.user.memberId || '',
      firstName: this.user.userprofile.firstName || '',
      lastName: this.user.userprofile.lastName || '',
      address: this.user.userprofile.address || '',
      address1: this.user.userprofile.address1 || '',
      city: this.user.userprofile.city || '',
      state: this.user.userprofile.state || '',
      postalZip: this.user.userprofile.postalZip || '',
      country: this.user.userprofile.country || '',
      mobileNumber: this.formatPhone(this.user.userprofile.mobileNumber) || ''
    });
  }

  public beginEdit() {
    this.isEditMode = true;
  }

  public save() {
    //if (!this.form.submitted) {
    //  // Causes validation to update.
    //  this.form.onSubmit(null);
    //  return;
    //}

    if (!this.userForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    let nuser: User;

    if (this.isNewUser) {
      //this.store$.dispatch(new RolesStoreActions.AddRoleRequestAction(editedRole))
    } else {
      nuser = Utilities.userDTO(this.user, this.authService.currentUser.uid);
      nuser.userprofile = this.getuserProfileData();
      nuser.displayName = this.getuserProfileData().firstName + " " + this.getuserProfileData().lastName;
      if (!this.updateFromUserList) {
        this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersProfileRequestAction(nuser));
        this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
          if (result) {
            this.alertService.showMessage("DATA UPDATE", "Profile data save successfully!", MessageSeverity.success);
          }
        });
      }
      else {
        this.store$.dispatch(new UsersStoreActions.UpdateUserProfileRequestAction(nuser));
        this.isListUserLoaded$.subscribe((result: Boolean) => {
          if (result) {
            this.alertService.showMessage("DATA UPDATE", "Profile data save successfully!", MessageSeverity.success);
          }
        });
      }
    }
    if (this.updateFromUserList) {
      this.onUserSaved.next(nuser);
    }
    this.alertService.stopLoadingMessage();
  }

  getuserProfileData(): userprofile {
    const formModel = this.userForm.value;
    return new userprofile(formModel.mobileNumber,
      formModel.firstName, formModel.lastName, formModel.address, formModel.address1,
      formModel.city, formModel.state, formModel.postalZip, formModel.country, this.user.userprofile.createdOn, this.user.userprofile.createdBy);
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
  verifysixdigitcode() {
    if (this.verifyCodeForm.controls['verifycode'].valid) {
      this.isVerifyingCode = true;
      this.accountService.verifyVerificationCode(new SixDigitData(this.userForm.controls['mobileNumber'].value.replace(/ /g, ''), this.verifyCodeForm.controls['verifycode'].value)).subscribe(
        data => { this.setMobileVerified(data); },
        error => this.alertService.showMessage("We are having issue in verifying the code provided. Either code is expired or a wrong code is provided. Please click Resend to get new code."));
    }
  }

  private setMobileVerified(data: any) {
    if (data.sid && data.status === 'approved') {
      this.alertService.showMessage("Successfully verified mobile information. Click Save button to save the profile.");
      this.isMobileVerified = true;
      this.isVerifyingCode = false;
      this.isMobileValid = false;
    }
    else if (data.sid && data.status === 'pending') {
      this.isVerifyingCode = false;
      this.alertService.showMessage("We are having issue in verifying the code provided. Either code is expired or a wrong code is provided. Please click Resend to get new code.");
    }

  }

  sendVerificationCode(event) {
    if (this.userForm.controls['mobileNumber'].valid) {
      if (this.user.userprofile.mobileNumber != this.userForm.controls['mobileNumber'].value) {
        //this.user.userprofile.mobileNumber = this.userForm.controls['mobileNumber'].value;
        this.sendingCodeIndicator = true;
        this.isMobileValid = true;
        this.isMobileVerified = false;
        this.verifyCodeForm.setValue({ verifycode: '' });
        this.accountService.sendVerificationCode(new SixDigitData(this.userForm.controls['mobileNumber'].value.replace(/ /g, ''), '')).subscribe(
          data => {
            this.enableVerificationSection(data);
            this.sendingCodeIndicator = false;
          },
          error => this.alertService.showMessage("Error Sending Verification Code. Please check the provided mobile number."));
      }
    }
  }

  resendcode() {
    if (this.userForm.controls['mobileNumber'].valid) {
      this.isMobileVerified == false;
      this.isResendingCode = true;
      this.sendingCodeIndicator = true;
      this.isMobileValid = true;
      this.accountService.sendVerificationCode(new SixDigitData(this.userForm.controls['mobileNumber'].value.replace(/ /g, ''), '')).subscribe(
        data => {
          this.isResendingCode = false;
          this.sendingCodeIndicator = false;
          this.enableVerificationSection(data);

        },
        error => {
          this.isResendingCode = false;
          this.sendingCodeIndicator = false;
          this.alertService.showMessage("Error Sending Verification Code. Please check the provided mobile number.");
        });
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
