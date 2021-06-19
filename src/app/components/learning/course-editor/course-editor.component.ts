// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Courses } from '@app/models/courses';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CurrencyPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { AppService, AuthService, AlertService, MessageSeverity, Utilities } from '@app/services';
import { Store } from '@ngrx/store';
import { RootStoreState, CoursesStoreActions } from '@app/store';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.scss']
})



export class CourseEditorComponent implements OnChanges {
  //@ViewChild(MatSlideToggle, { static: true }) active: MatSlideToggle;
  @ViewChild('form', { static: true })
  private form: NgForm;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: '1200px',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };


  isNewCourse = false; UserRole: any;
  public isSaving = false;
  private onCourseSaved = new Subject<Courses>();
  formattedAmount;
  @Input() course: Courses = new Courses();
  @Input() isEditMode = false;
  courseForm: FormGroup;
  courseSaved$ = this.onCourseSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();
  shortDesc: any;
  CourseAudienceBind: string;
  AgendaBind: string;

 
  get Name() {
    return this.courseForm.get('Name');
  }
  get ShortDescription() {
    return this.courseForm.get('ShortDescription');
  }

  get IsActive() {
    return this.courseForm.get('IsActive');
  }
  get Price() {
    return this.courseForm.get('Price');
  }
  get Schedule() {
    return this.courseForm.get('Schedule');
  }
  get StartDate() {
    return this.courseForm.get('StartDate');
  }
  get Agenda() {
    return this.courseForm.get('Agenda');
  }
  get CourseAudience() {
    return this.courseForm.get('CourseAudience');
  }
  get CourseDescription() {
    return this.courseForm.get('CourseDescription');
  }
  get GeneralAudience() {
    return this.courseForm.get('GeneralAudience');
  }

  get Prerequisites() {
    return this.courseForm.get('Prerequisites');
  }
  get NumberofSessions
    () {
    return this.courseForm.get('NumberofSessions');
  }
  get Instructor
    () {
    return this.courseForm.get('Instructor');
  }
  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }


  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private store$: Store<RootStoreState.State>
  ) {
    this.UserRole = JSON.parse(sessionStorage.getItem('current_user')).roles[0];
    console.log('User Role' , this.UserRole);
    
    this.buildForm();
    this.courseForm.controls.ShortDescription.setValue('Hello World');
   }
   editDisable() {
    if(this.UserRole === 'Adminstrator') {
      return true;
    } else {
      return false;
    }
  }
  GetRoles() {
    if (this.UserRole === 'Administrator') {
      // this.isEditMode = true;
      this.courseForm.enable();
    } else {
      // this.isEditMode = false;
      this.courseForm.disable();
    }
  }

  ngOnChanges() {
    if (this.course) {
      this.isNewCourse = false;
    } else {
      this.isNewCourse = true;
      this.course = new Courses();
    }
    this.resetForm();
    this.GetRoles();
  }


  private buildForm() {
    this.courseForm = this.formBuilder.group({
      Name: ['', Validators.required],
      ShortDescription: ['', Validators.required],
      CourseDescription: ['', Validators.required],
      IsActive: '',
      Price: ['', Validators.required],
      Schedule: ['', Validators.required],
      StartDate: ['', Validators.required],
      CourseAudience: ['', Validators.required],
      Agenda: ['', Validators.required],
      GeneralAudience: ['', Validators.required],
      Prerequisites: ['', Validators.required],
      NumberofSessions: [''],
      Instructor: ['']
    });
  }


  public resetForm(stopEditing = false) {
    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.course) {
      this.isNewCourse = true;
      this.course = new Courses();
    }
    this.courseForm.reset({
      Name: this.course.Name || '',
      ShortDescription: this.course.ShortDescription || '',
      CourseDescription: this.course.CourseDescription || '',
      IsActive: this.course.IsActive || '',
      Price: this.currencyPipe.transform(this.course.Price, '$') || '',
      Schedule: this.course.Schedule || '',
      StartDate: Utilities.checkDate(this.course.StartDate) || '',
      CourseAudience: this.course.CourseAudience || '',
      Agenda: this.course.Agenda || '',
      GeneralAudience: this.course.GeneralAudience || '',
      Prerequisites: this.course.Prerequisites || '',
      NumberofSessions: this.course.NumberofSessions || '',
      Instructor: this.course.Instructor || '',
    });
    this.shortDesc = this.course.ShortDescription;
    this.AgendaBind = this.course.Agenda;
    this.CourseAudienceBind = this.course.CourseAudience;
    console.log('Short Desc' , this.shortDesc);
  }

  public beginEdit() {
    this.isEditMode = true;
  }


  public save() {
    console.log("here");
    if (!this.form.submitted) {
      console.log("here1");
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.courseForm.valid) {
      console.log("here2");
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    //this.alertService.startLoadingMessage('Saving changes...');
    const editedCourse = this.getEditedCourse();

    if (this.isNewCourse) {
      this.store$.dispatch(new CoursesStoreActions.AddCourseRequestAction(editedCourse))
    } else {
      this.store$.dispatch(new CoursesStoreActions.UpdateCourseRequestAction(editedCourse))
    }
    console.log("here3");
    this.onCourseSaved.next(this.course);
    //this.alertService.stopLoadingMessage();
  }

  private getEditedCourse(): Courses {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const formModel = this.courseForm.value;
    let courseedit: Courses = new Courses();
    courseedit.id = this.isNewCourse ? this.appService.getNewDocId() : this.course.id,
      courseedit.Name = formModel.Name,
      courseedit.ShortDescription = formModel.ShortDescription,
      courseedit.CourseDescription = formModel.CourseDescription,
      courseedit.Schedule = formModel.Schedule,
      courseedit.StartDate = new Date(formModel.StartDate),
      courseedit.CourseAudience = formModel.CourseAudience,
      courseedit.Agenda = formModel.Agenda,
      courseedit.GeneralAudience = formModel.GeneralAudience,
      courseedit.Prerequisites = formModel.Prerequisites,
      courseedit.NumberofSessions = formModel.NumberofSessions,
      courseedit.Instructor = formModel.Instructor,
      courseedit.Price = Number(formModel.Price.replace(/[^0-9\.]+/g, "")),
      courseedit.IsActive = formModel.IsActive,
      courseedit.CreatedOn = this.isNewCourse ? new Date(now_utc) : this.course.CreatedOn,
      courseedit.CreatedBy = this.isNewCourse ? this.authService.currentUser.uid : this.course.CreatedBy
    return courseedit;
  }

  transformSecondsToDate(secondsValu: any): Date {
    if (secondsValu) {
      const unixTime = secondsValu;
      const date = new Date(unixTime["seconds"] * 1000);
      return date;
    }
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

  private saveCompleted(course?: Courses) {
    if (course) {
      //this.raiseEventIfRolesModified(this.subscription, subscription);
      this.course = course;
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
