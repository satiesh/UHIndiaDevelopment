// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { AlertService, AuthService, MessageSeverity } from '@app/services';
import { UserLogin } from '@app/models';
import { Router } from '@angular/router';
import { LocalStoreManager } from '@app/services';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import { CurrentUsersStoreActions, RootStoreState } from '../../store';

@Component({
  selector: 'app-login-control',
  templateUrl: './login-control.component.html',
  styleUrls: ['./login-control.component.scss']
})
export class LoginControlComponent implements OnInit, OnDestroy {

  isLoading = false;
  loginStatusSubscription: any;
  hide = true;
  loginForm: FormGroup;
  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;
  @ViewChild('form', { static: true })
  private form: NgForm;

  @Input()
  isModal = false;
  UserRole: string;
  @Output()
  enterKeyPress = new EventEmitter();
  redirectUrl: string;
  courseId: string;
  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sessionValue: LocalStoreManager,
    private store$: Store<RootStoreState.State>,
    private router: Router) {
    const redirect = this.router.url;
    const red = redirect.split('?')[1];
    const url = decodeURIComponent((red + '').replace(/\+/g, '%20'));
    const withidUrl = url.slice(0, url.length - 1);
    this.courseId = withidUrl.substring(withidUrl.lastIndexOf('/') + 1, withidUrl.length);
    this.redirectUrl = withidUrl.substring(0, withidUrl.lastIndexOf('/') + 1);
    this.buildForm();
  }

  ngOnInit(): void {
    this.loginForm.setValue({
      email: '',
      password: '',
      rememberMe: this.authService.rememberMe
    });
    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.authRedirect();
      //this.loginStatusSubscription = this.authService.getLoginStatusEvent()
      //  .subscribe(isLoggedIn => {
      //    if (isLoggedIn) {
      //      this.authRedirect();
      //    }
      //  });
    }
  }

  async authRedirect() {
    this.loginStatusSubscription = this.authService.getLoginStatusEvent()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          console.log(sessionStorage.getItem('current_user'));
          this.UserRole = JSON.parse(sessionStorage.getItem('current_user')).roles[0];
          if (this.redirectUrl === 'auth/course-purchase/') {
            this.router.navigate(['auth/course-purchase', { data: this.courseId }]);
          } else if (this.UserRole === 'Subscriber' && this.redirectUrl !== 'auth/course-purchase/') {
            this.router.navigate(['auth/reports']);
          }
          else {
            this.router.navigate(['auth/dashboard']);
          }
        }
      });
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
      rememberMe: ''
    });
  }

  async login() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.loginForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    let returnValue: string;
    this.isLoading = true;
    this.authService.SignIn(this.getUserLogin())
      .then((result) => {
        if (result) {
          returnValue = result;
          if (returnValue == "1") {
            this.router.navigate(['/verifyemail']);
          }
          else if (returnValue == "3") {
            //this.authRedirect();
            this.router.navigate(['/redirect']);
          }
          else {
            this.alertService.showStickyMessage('Unable to login', returnValue["message"], MessageSeverity.error);
          }
          this.isLoading = false;
          console.log(returnValue);
        }
      })
      .catch ((error) => {
      this.alertService.showStickyMessage('Unable to login', error.message, MessageSeverity.error, error);
      this.isLoading = false;
    });

    //this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
  }

  async setUserData() {
    //this.authService.UpdateUserDataNewI()
    //  .then((result) => {
    //    if (result) {
    //      this.router.navigate(['/redirect']);
    //    }
    //  });
  }
  getUserLogin(): UserLogin {
    const formModel = this.loginForm.value;
    return new UserLogin(formModel.email, formModel.password, formModel.rememberMe);
  }


  getShouldRedirect() {
    return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }
  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  enterKeyDown() {
    this.enterKeyPress.emit();
  }

  ngOnDestroy(): void {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }

}
