// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { AlertService, AuthService} from '@app/services';
import { UserLogin } from '@app/models';
import { Router } from '@angular/router';
import { LocalStoreManager } from '@app/services';

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
    private formBuilder: FormBuilder ,
    private sessionValue: LocalStoreManager,
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
            this.loginStatusSubscription = this.authService.getLoginStatusEvent()
              .subscribe(isLoggedIn => {
                if (isLoggedIn) {
                  this.UserRole = JSON.parse(sessionStorage.getItem('current_user')).roles[0];
                  if (this.redirectUrl === 'auth/course-purchase/') {
                    this.router.navigate(['auth/course-purchase'  , { data: this.courseId  }]);
                  }else if (this.UserRole === 'Subscriber' && this.redirectUrl !== 'auth/course-purchase/') {
                    this.router.navigate(['auth/reports']);
                  }
                   else{
                    this.router.navigate(['auth/dashboard']);
                  }
                }
                if (this.getShouldRedirect()) {
                  this.authService.redirectLoginUser();
                }
              });
          }
                 }

    buildForm() {
      this.loginForm = this.formBuilder.group({
        email: ['',[Validators.required,Validators.email]],
        password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
        rememberMe: ''
      });
    }

    login() {
      if (!this.form.submitted) {
        this.form.onSubmit(null);
        return;
      }
  
      if (!this.loginForm.valid) {
        this.alertService.showValidationError();
        return;
      }
      this.isLoading = true;
      this.authService.SignIn(this.getUserLogin());
      this.isLoading = false;
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
