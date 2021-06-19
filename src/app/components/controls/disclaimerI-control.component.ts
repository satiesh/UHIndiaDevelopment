import { Component, ViewChild, OnInit, Input, Inject } from '@angular/core';
import { AppService, AuthService } from '../../services';
import { NgForm, FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { questions, userquestions, disclaimer } from '../../models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, QuestionStoreSelectors, QuestionStoreActions } from '../../store';
import { MatRadioChange } from '@angular/material/radio';
import { questionpdfarray } from '../../models/questionpadfarray';

@Component({
  selector: 'app-disclaimerI-control',
  templateUrl: './disclaimerI-control.component.html',
  styleUrls: ['./disclaimerI-control.component.scss']
})
export class DisclaimerIControlComponent implements OnInit {
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

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>) {
    this.buildForm();
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
    this.addRadioButtons();
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
      this.readMeSlider = false;
      this.buildForm();
      this.addRadioButtons();
      this.finalArray = [];
    }
  }
}
