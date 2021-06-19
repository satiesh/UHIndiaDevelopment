// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AppService } from '@app/services';
import { disclaimer } from '@app/models/disclaimer';

@Component({
    selector: 'app-disclaimer-control',
    templateUrl: './disclaimer-control.component.html',
    styleUrls: ['./disclaimer-control.component.scss']
  })

  export class DisclaimerControlComponent implements OnInit {
    @ViewChild('divID', { static: true }) divID: ElementRef;
    @ViewChild('form', { static: true })

    private disclaimberform: NgForm;
    public isSaving = false;
    disclaimer:disclaimer;
    disclaimerForm: FormGroup;
    public readMeSlider: boolean;
    get acceptTerms() {return this.disclaimerForm.get('acceptTerms');}

    constructor(private appService: AppService,private alertService: AlertService,private formBuilder: FormBuilder) 
    { 
      this.buildForm();
    }
  
    ngOnInit(): void {
     // this.readMeSlider=false; 
      let disclaimerList=this.appService.getDisclaimer();
      if(disclaimerList)
      {
        disclaimerList.subscribe(val=>{this.disclaimer=val[0];this.divID.nativeElement.innerHTML = this.disclaimer.disclaimerText});
      }
    }

    private buildForm() {
        this.disclaimerForm = this.formBuilder.group({
            acceptTerms: ['', Validators.required]
        });
    }

    public AknowledgeReadMe(event) {

      if (event.checked == true) {
          this.readMeSlider = true;
      }
      else {
          this.readMeSlider = false;
          this.buildForm();
      }
  }
    public save(){

        if (!this.disclaimberform.submitted) {
            // Causes validation to update.
            this.disclaimberform.onSubmit(null);
            return;
          }
          if (!this.disclaimerForm.valid) {
            this.alertService.showValidationError();
            return;
          }
    }
  }
