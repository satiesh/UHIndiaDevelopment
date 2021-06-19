// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AlertService, AuthService  } from '@app/services';
import { UserLogin } from '@app/models';
import { EqualValidator } from 'src/app/shared/validators/equal.validator';

@Component({
    selector: 'app-register-control',
    templateUrl: './register-control.component.html',
    styleUrls: ['./register-control.component.scss']
  })
  export class RegisterControlComponent implements OnInit, OnDestroy {

    isLoading = false;
    loginStatusSubscription: any;
    private passwordWatcher: Subscription;
    registerForm: FormGroup;

    @ViewChild('form', { static: true })
    private form: NgForm;
    hide = true;
    @Input()
    isModal = false;
  
    @Output()
    enterKeyPress = new EventEmitter();

    // form properties
    get email() { return this.registerForm.get('email'); }

    get password() {return this.registerForm.get('password');}

    get newPassword() { return this.password.get('newPassword'); }
    
    get confirmPassword() { return this.password.get('confirmPassword'); }

    

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

    ngOnInit(): void {
        this.registerForm.setValue({
            email: '',
            password: {
              newPassword: '',
              confirmPassword: ''
            },
          });

          if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
          } else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent()
              .subscribe(isLoggedIn => {
                if (this.getShouldRedirect()) {
                  this.authService.redirectLoginUser();
                }
              });
          }
    }

    private buildForm() {
      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
        password: this.formBuilder.group({
          newPassword: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
          confirmPassword: ['', [Validators.required, EqualValidator('newPassword')]],
        })
      });
     // this.passwordWatcher = this.newPassword.valueChanges.subscribe(() => this.confirmPassword.updateValueAndValidity());
    }

    register() {
      if (!this.form.submitted) {
        this.form.onSubmit(null);
        return;
      }
  
      if (!this.registerForm.valid) {
        this.alertService.showValidationError();
        return;
      }
      this.isLoading = true;
      this.authService.SignUp(this.getUserLogin());
      this.isLoading = false;
      this.registerForm.reset();
    }

    getUserLogin(): UserLogin {
      const formModel = this.registerForm.value;
      return new UserLogin(formModel.email, formModel.password.newPassword, formModel.rememberMe);
    }
  

    getShouldRedirect() {
      return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
    }
  
    enterKeyDown() {
      this.enterKeyPress.emit();
    }
    ngOnDestroy(): void {
      if (this.loginStatusSubscription) {
        this.loginStatusSubscription.unsubscribe();
      }
    }

  }
