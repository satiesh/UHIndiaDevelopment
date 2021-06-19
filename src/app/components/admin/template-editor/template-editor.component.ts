// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, OnChanges, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { template} from '@app/models';
import { Subject, Observable } from 'rxjs';
import {
  AlertService, AccountService, AuthService, Utilities, AppService, MessageSeverity
} from '@app/services';
import { Store } from '@ngrx/store';
import { RootStoreState, SubscriptionStoreSelectors, CoursesStoreSelectors, CoursesStoreActions, SubscriptionStoreActions } from '../../../store';
import { TemplateStoreActions, TemplateStoreSelectors } from '../../../store/template-data';



interface TemplateTypes {
  name: string;
  value: string;
}

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})

export class TemplateEditorComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewTemplate = false;
  private onTemplateSaved = new Subject<template>();
  @Input() template: template;
  @Input() isEditMode: boolean;

  templateForm: FormGroup;
  templateSaved$ = this.onTemplateSaved.asObservable();
  isTemplatesLoaded$: Observable<boolean>;

  get discounteditem() {
    return this.templateForm.get('discounteditem');
  }
  get expiresOn() {
    return this.templateForm.get('expiresOn');
  }
  get isactive() {
    return this.templateForm.get('isactive');
  }
  get name() {
    return this.templateForm.get('name');
  }
  get type() {
    return this.templateForm.get('type');
  }
  get value() {
    return this.templateForm.get('value');
  }

  get courses() {
    return this.templateForm.get('courses');
  }

  get subscriptions() {
    return this.templateForm.get('subscriptions');
  }


  get applyall() {
    return this.templateForm.get('applyall');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) {

    this.buildForm();
  }

  private buildForm() {
    this.templateForm = this.formBuilder.group({
      expiresOn: ['', Validators.required],
      isactive: '',
      name: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
      courses: '',
      subscriptions: '',
      applyall: false
    });
  }

  ngOnInit() {
    this.isTemplatesLoaded$ = this.store$.select(TemplateStoreSelectors.selectTemplatesLoaded);
  }



  ngOnChanges() {
    if (this.template) {
      this.isNewTemplate = false;
    } else {
      this.isNewTemplate = true;
      this.template = null;
    }

    this.resetForm();
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.template) {
      this.isNewTemplate = true;
      this.template = new template();
    }

    this.templateForm.reset({
      //expiresOn: Utilities.checkDate(this.template.expiresOn) || '',
      //isactive: this.template.isactive || '',
      //name: this.template.name || '',
      //type: this.template.type || '',
      //value: this.template.value || '',
      //applyall: this.template.discounteditem == "All" ? true : false,
      //courses: this.template.discounteditem.split(',') || [],
      //subscriptions: this.template.discounteditem.split(',') || []
    });
  }

  save() {
    if (!this.templateForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    const editedtemplate = this.getEditedTemplate();
    if (this.isNewTemplate) {
      this.store$.dispatch(new TemplateStoreActions.AddTemplateRequestAction(editedtemplate));
      this.isTemplatesLoaded$.subscribe(result => {
        if (result) {
          this.alertService.showMessage("COUPON ADDED", "Succesfully added new template", MessageSeverity.success);
        }
      });

    }
    else {
      this.store$.dispatch(new TemplateStoreActions.UpdateTemplateRequestAction(editedtemplate));
      this.isTemplatesLoaded$.subscribe(result => {
        if (result) {
          this.alertService.showMessage("COUPON UPDATE", "Succesfully updated new template", MessageSeverity.success);
        }
      });

    }

    this.onTemplateSaved.next(this.template);

  }

  getEditedTemplate() {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const formModel = this.templateForm.value;
    let ntemplate: template = new template();
    //template.id = this.isNewTemplate ? this.appService.getNewDocId() : this.template.id;
    //template.expiresOn = new Date(formModel.expiresOn);
    //template.isactive = formModel.isactive;
    //template.name = formModel.name;
    //template.type = formModel.type;
    //template.value = formModel.value;
    //if (formModel.applyall) {
    //  template.discounteditem = "All";
    //}
    //else {
    //  var disitem = formModel.courses.join(',');
    //  disitem = disitem + "," + formModel.subscriptions.join(',');
    //  template.discounteditem = disitem;
    //}
    //template.createdon = this.isNewTemplate ? new Date(now_utc) : this.template.createdon;
    //template.createdby = this.isNewTemplate ? this.authService.currentUser.uid : this.template.createdby;
    return ntemplate;
  }

  ngOnDestroy(): void {

  }

}
