// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreActions, CurrentUsersStoreSelectors, QuestionStoreSelectors, QuestionStoreActions } from '@app/store';
import { Observable } from 'rxjs';
import { AuthService, Utilities, MessageSeverity, AlertService, AppService } from '@app/services';
import { userdisclaimer, userquestions, questions, disclaimer } from '../../models';
import { DatePipe } from '@angular/common';
import { User } from '../../models/user';
import { NgForm, FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { questionpdfarray } from '../../models/questionpadfarray';
import { MatRadioChange } from '@angular/material/radio';



@Component({
  selector: 'app-disclaimer-dialog',
  templateUrl: 'disclaimer-dialog.component.html',
  styleUrls: ['disclaimer-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DisclaimerDialogComponent {
  userDisclaimer: userdisclaimer;
  userquestions: userquestions[];

  @ViewChild('form', { static: true })
  section1para0: string;
  section2para0: string;
  section2para1: string;
  section2para2: string;
  section4para0: string;
  disclaimer: disclaimer;

  //Questions Store Variables
  questionLoadingIndicator$: Observable<boolean>;
  isQuestionsLoaded$: Observable<boolean>;
  selectQuestions$: Observable<questions[]>;
  //End Questions Store Variables

  private form: NgForm;
  questionForm: FormGroup;
  questionsData: questions[] = [];
  questionArray: questionpdfarray[] = [];
  finalArray: userquestions[] = [];
  finalpdfArray: questionpdfarray[] = [];
  answerType: string;
  answerTypes: string[] = ['No', 'Yes'];
  public readMeSlider: boolean;



  date = new Date();
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;
  constructor(
    private appService: AppService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DisclaimerDialogComponent>,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>) {
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));
  }
  ngOnInit() {
    this.questionLoadingIndicator$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoading);
    this.isQuestionsLoaded$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoaded);
    this.selectQuestions$ = this.store$.select(QuestionStoreSelectors.selectQuestions);
    this.isQuestionsLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new QuestionStoreActions.QuestionRequestAction());
      }
    });
    let disclaimerList = this.appService.getDisclaimer();
    if (disclaimerList) {
      disclaimerList.subscribe(val => {
        this.disclaimer = val[0];
        this.setSections();
      });
    }
    this.buildForm();
    this.addRadioButtons();
  }



  cancel(): void {
    this.dialogRef.close(null);
  }
  private buildForm() {
    this.questionForm = this.formBuilder.group({
      acceptTerms: ['', Validators.required],
      questions: new FormArray([])
    });
  }

  get questionsFormArray() {
    return this.questionForm.controls.questions as FormArray;
  }

  get acceptTerms() { return this.questionForm.get('acceptTerms'); }

  setSections() {
    if (this.disclaimer) {
      this.section1para0 = this.disclaimer.section1["para"][0];
      this.section2para0 = this.disclaimer.section2["para"][0];
      this.section2para1 = this.disclaimer.section2["para"][1];
      this.section2para2 = this.disclaimer.section2["para"][2];
      this.section4para0 = this.disclaimer.section3["para"][0];
    }
  }

  radioChange(event: MatRadioChange, data) {
    var obj = this.questionsData.filter(x => x.id == data.id)[0];
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    let ouserquestions: userquestions = new userquestions(obj.id, event.value == 'No' ? false : true, new Date(now_utc), this.authService.currentUser.uid);
    let questionpdfs: questionpdfarray = new questionpdfarray(obj.id, obj.question, event.value == 'No' ? "NO" : "YES");
    var existsuserquestions: userquestions = this.finalArray.filter(x => x.questionid == data.id)[0];
    var existspdf: questionpdfarray = this.finalpdfArray.filter(x => x.id == data.id)[0];

    if (!existsuserquestions) {
      this.finalArray.push(ouserquestions);
      this.finalpdfArray.push(questionpdfs);
    }
    else {
      existsuserquestions.accepted = event.value == 'No' ? false : true;
      existspdf.result = event.value == 'No' ? "NO" : "YES";
    }
  }

  //checkFormValidity() {
  //  if (this.questionsData.length == this.finalArray.length)
  //    return true;
  //}


  checkFormValidity() {
    if (this.questionsData.length == this.finalArray.length) {
      let ouserquestions: userquestions = this.finalArray.find(e => e.questionid === 'c0gpZV6RM1vHxOZ3u321');
      if (ouserquestions.accepted == true) {
        return true;
      }
      else {
        return false;
      }
    }
    {
      return false;
    }
  }



  private addRadioButtons() {
    this.isQuestionsLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectQuestions$.subscribe((data: questions[]) => {
          if (data && data.length > 0) {
            this.questionsData = data;
            data.forEach(() => this.questionsFormArray.push(new FormControl('')));
          }
        }
        )
      }
    });
  }

  public aknowledgeReadMe(event) {

    if (event.checked == true) {
      this.readMeSlider = true;
    }
    else {
      console.log("here");
      this.readMeSlider = false;
      this.buildForm();
      this.addRadioButtons();
      this.finalArray = [];
    }
  }


  save() {
    var currentUser: User = new User();
    this.userDisclaimer = new userdisclaimer(this.disclaimer.id,
      this.readMeSlider,
      new Date(this.datePipe.transform(this.date, "MM/dd/yyyy")), this.authService.currentUser.uid);
    this.userquestions = this.finalArray;
    this.selectCurrentUser$.subscribe(data => {
      if (data) {
        currentUser = data;
      }
    })
    if (currentUser && currentUser.uid) {
      let nuser = Utilities.userDTO(currentUser, this.authService.currentUser.uid);
      nuser.userdisclaimer = this.userDisclaimer;
      nuser.userquestions = this.userquestions;
      console.log(nuser);
      this.store$.dispatch(new CurrentUsersStoreActions.UpdateUserDisclaimerRequestAction(nuser));
      this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Disclaimer data save successfully!", MessageSeverity.success);
          this.cancel();
        }
      });
    }
  }
}
