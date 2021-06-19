import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { AppService, AuthService } from '@app/services';
import { questions, userquestions } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, QuestionStoreSelectors, QuestionStoreActions } from '../../store';
import { NgForm, FormGroup, FormBuilder, FormArray, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';


@Component({
  selector: 'app-questioner',
  templateUrl: './questioner-control.component.html',
  styleUrls: ['./questioner-control.component.scss']
})

export class QuestionerControlComponent implements OnInit {

  @ViewChild('form', { static: true })
  private form: NgForm;
  questionForm: FormGroup;
  questionsData: questions[] = [];
  loadingIndicator$: Observable<boolean>;
  isQuestionsLoaded$: Observable<boolean>;
  selectQuestions$: Observable<questions[]>;
  finalArray: userquestions[] = [];
  answerType: string;
  answerTypes: string[] = ['No', 'Yes'];


  constructor(private appService: AppService, private authService: AuthService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>) {
    this.buildForm();
  }


  async  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoading);
    this.isQuestionsLoaded$ = this.store$.select(QuestionStoreSelectors.selectQuestionsLoaded);
    this.selectQuestions$ = this.store$.select(QuestionStoreSelectors.selectQuestions);
    await this.isQuestionsLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new QuestionStoreActions.QuestionRequestAction());
      }
    });
    this.addRadioButtons();
  }


  get questionsFormArray() {
    return this.questionForm.controls.questions as FormArray;
  }

  private buildForm() {
    this.questionForm = this.formBuilder.group({
      questions: new FormArray([])
    });
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

  radioChange(event: MatRadioChange, data) {
    var obj = this.questionsData.filter(x => x.id == data.id)[0];
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    let ouserquestions: userquestions = new userquestions(obj.id, event.value == 'No' ? false : true, new Date(now_utc), this.authService.currentUser.uid);
    var existsuserquestions: userquestions = this.finalArray.filter(x => x.questionid == data.id)[0];
    //if (!this.finalArray.some(x => x.questionid == data.id)) {
    if (!existsuserquestions) {
      this.finalArray.push(ouserquestions);
    }
    else {
      existsuserquestions.accepted = event.value == 'No' ? false : true
    }
  }

  checkFormValidity() {
    if (this.questionsData.length == this.finalArray.length)
      return true;
  }


  validateradiobutton() {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        //  // get a list of checkbox values(boolean)
        .map(control => control.value)
        //  // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);
      //// if the total is not greater than the minimum, return the error message
      console.log(totalSelected);
      return totalSelected >= this.finalArray.length ? null : { required: true };
    }
    return validator;
  }

  save() {
    const selectedOrderIds = this.questionForm.value.questions
      .map((v, i) => v ? this.questionsData[i].id : null)
      .filter(v => v !== null);
    console.log(selectedOrderIds);
  }



}
