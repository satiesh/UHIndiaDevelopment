// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { environment as env } from '@environments/environment';
import { AlertService, AppTranslationService, AuthService, AccountService, ValidationService, ConfirmValidParentMatcher, MessageSeverity } from 'src/app/services';
import { FormatPhonePipe } from '@app/pipes/format.phone';
import { userprofile, SixDigitData } from '@app/models';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import { RootStoreState, UsersStoreSelectors } from '../../store';



@Component({
  selector: 'app-profile-control',
  templateUrl: './profile-control.component.html',
  styleUrls: ['./profile-control.component.scss']
})


export class ProfileControlComponent implements OnInit {

  @ViewChild('form', { static: true })
  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  private form: NgForm;
  public isSaving = false;
  private onUserSaved = new Subject<userprofile>();
  isNewUser = true;
  isProduction: boolean = env.production;
  @Input() userData: userprofile = new userprofile();
  @Input() isEditMode = false;

  userProfileForm: FormGroup;
  verifyCodeForm: FormGroup;
  emailForm: FormGroup;
  isVerifyingCode: boolean = false;
  isResendingCode: boolean = false;
  isValieEmail: boolean = false;
  userDocId: string;
  userUid: string;
  userSaved$ = this.onUserSaved.asObservable();
  isUsersLoaded$: Observable<boolean>;
  selectUsers$: Observable<User>;

  isMobileValid = false;
  isMobileVerified = false;
  sendingCodeIndicator: boolean=false;

  get firstName() {
    return this.userProfileForm.get('firstName');
  }
  get lastName() {
    return this.userProfileForm.get('lastName');
  }
  get address() {
    return this.userProfileForm.get('address');
  }
  get address1() {
    return this.userProfileForm.get('address1');
  }
  get city() {
    return this.userProfileForm.get('city');
  }
  get state() {
    return this.userProfileForm.get('state');
  }
  get postalzip() {
    return this.userProfileForm.get('postalzip');
  }
  get country() {
    return this.userProfileForm.get('country');
  }
  get mobilenumber() {
    return this.userProfileForm.get('mobilenumber');
  }
  get verifycode() {
    return this.verifyCodeForm.get('verifycode');
  }
  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
    this.buildverifycodeForm();
  }


  private buildForm() {
    this.userProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      address1: '',
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalzip: ['', Validators.required],
      country: ['', Validators.required],
      mobilenumber: ['', [Validators.required, Validators.maxLength(20), ValidationService.mobileValidator]]
    });
  }

  private buildverifycodeForm() {
    this.verifyCodeForm = this.formBuilder.group({
      verifycode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    if (!this.isNewUser) {
      let userprofileList = this.accountService.getuser(this.authService.currentUser.uid);
      if (userprofileList) {
        userprofileList.subscribe(val => { this.userData = val[0]; this.setUserValue(); });
      }
    }
  }

  private setUserValue() {

    this.userDocId = this.userData ? this.userData.docId : '';
    this.userUid = this.userData ? this.authService.currentUser.uid : this.authService.currentUser.uid;

    this.userProfileForm.setValue({
      firstName: this.userData ? this.userData.firstName : '',
      lastName: this.userData ? this.userData.lastName : '',
      address: this.userData ? this.userData.address : '',
      address1: this.userData ? this.userData.address1 : '',
      city: this.userData ? this.userData.city : '',
      state: this.userData ? this.userData.state : '',
      postalzip: this.userData ? this.userData.postalZip : '',
      country: this.userData ? this.userData.country : '',
      mobileNumber: this.userData ? this.userData.mobileNumber : ''
    });
    this.verifyCodeForm.setValue({
      verifycode: ''
    });
  }
  
verifyEmailExists(event)
{
  if (!this.isEditMode) {
    this.isUsersLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    this.selectUsers$ = this.store$.select(UsersStoreSelectors.selectUserByEmail(this.emailForm.controls['email'].value));
    this.selectUsers$.subscribe(data => {
      if (data) {
        this.isValieEmail = false;
        this.alertService.showStickyMessage("USER EXISTS", "User already exist with the same email address. Please use a new email address.", MessageSeverity.error);
      }
      else { this.isValieEmail = true;}
    })
  }
}
  sendVerificationCode(event) {
    if (this.userProfileForm.controls['mobilenumber'].valid) {
      if (this.userData.mobileNumber != this.userProfileForm.controls['mobilenumber'].value) {
        this.userData.mobileNumber = this.userProfileForm.controls['mobilenumber'].value;
        this.sendingCodeIndicator = true;
        this.isMobileValid = true;
        this.isMobileVerified = false;
        this.verifyCodeForm.setValue({ verifycode: '' });
        this.accountService.sendVerificationCode(new SixDigitData(this.userProfileForm.controls['mobilenumber'].value.replace(/ /g, ''), '')).subscribe(
          data => {
            this.enableVerificationSection(data);
            this.sendingCodeIndicator = false;
          },
          error => {
            this.alertService.showMessage("Error Sending Verification Code. Please check the provided mobile number.");
            this.sendingCodeIndicator = false;
          });
      }
    }
  }

  private enableVerificationSection(data: any) {
    if (data.sid && data.status === 'pending') {
      this.isMobileValid = true;
    }
  }


  verifysixdigitcode() {
    if (this.verifyCodeForm.controls['verifycode'].valid) {
      this.isVerifyingCode = true;
      this.accountService.verifyVerificationCode(new SixDigitData(this.userProfileForm.controls['mobilenumber'].value.replace(/ /g, ''), this.verifyCodeForm.controls['verifycode'].value)).subscribe(
        data => { this.setMobileVerified(data); },
        error => this.alertService.showMessage("We are having issue in verifying the code provided. Either code is expired or a wrong code is provided. Please click Resend to get new code."));
    }
  }
  private setMobileVerified(data: any) {
    if (data.sid && data.status === 'approved') {
      this.alertService.showMessage("Successfully verified mobile information. Click Next to proceed further.");
      this.isMobileVerified = true;
      this.isVerifyingCode = false;
      this.isMobileValid = false;
    }
    else if (data.sid && data.status === 'pending') {
      this.isVerifyingCode = false;
      this.alertService.showMessage("We are having issue in verifying the code provided. Either code is expired or a wrong code is provided. Please click Resend to get new code.");
    }

  }

  resendcode() {
    if (this.userProfileForm.controls['mobilenumber'].valid) {
      this.isMobileVerified == false;
      this.isResendingCode = true;
      this.sendingCodeIndicator = true;
      this.isMobileValid = true;
      this.accountService.sendVerificationCode(new SixDigitData(this.userProfileForm.controls['mobilenumber'].value.replace(/ /g, ''), '')).subscribe(
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

  ngOnChanges() {

  }
  public save() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }
    if (!this.userProfileForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    //this.accountService.updateUserProfile(this.getuserProfileData(), this.userDocId);

    //this.accountService.updateUserProfile(this.userData);
    /*
    const editedUser = this.getEditedUser();

    if (this.isNewUser) {
      this.accountService.newUser(editedUser).subscribe(
        user => this.saveCompleted(user),
        error => this.saveFailed(error));
    } else {
      this.accountService.updateUser(editedUser).subscribe(
        () => this.saveCompleted(editedUser),
        error => this.saveFailed(error));
    }
    */
  }


  getnewuserProfileData(): userprofile {
    var date = new Date();
    const formModel = this.userProfileForm.value;
    return new userprofile(formModel.mobilenumber,
      formModel.firstName, formModel.lastName, formModel.address, formModel.address1,
      formModel.city, formModel.state, formModel.postalzip, formModel.country, new Date(this.datePipe.transform(date, "MM/dd/yyyy")), this.authService.currentUser.uid);
  }

  getuserProfileData(): userprofile{
    const formModel = this.userProfileForm.value;
    return new userprofile(formModel.mobilenumber,
      formModel.firstName, formModel.lastName, formModel.address, formModel.address1,
      formModel.city, formModel.state, formModel.postalzip, formModel.country);
  }

  mobileChange(event: MatSelectChange) {
    this.userProfileForm.controls["mobilenumber"].setValue(
      new FormatPhonePipe().transform(
        this.userProfileForm.controls["mobilenumber"].value,
        "mobile"
      ).FormattedPhone
    );
  }

  phoneChange(event: MatSelectChange) {
    this.userProfileForm.controls["phonenumber"].setValue(
      new FormatPhonePipe().transform(
        this.userProfileForm.controls["phonenumber"].value,
        "phone"
      ).FormattedPhone
    );
  }




  public cancel() {
    this.alertService.resetStickyMessage();
  }

}
