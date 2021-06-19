// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService, AlertService, MessageSeverity } from '@app/services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  @ViewChild('form', { static: true })
  private form: NgForm;


  constructor(
    private alertService: AlertService,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.forgotForm.setValue({
      email: ''
    });

  }
  buildForm() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }

  forgot() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.forgotForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.authService.ForgotPassword(this.email.value);
  }
  get email() { return this.forgotForm.get('email'); }

}
