import { Component, Input } from '@angular/core';
import { PdfService, AppService, AuthService } from '@app/services';
import { disclaimer, questions } from '@app/models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, QuestionStoreSelectors, QuestionStoreActions } from '../../../store';
import { FormBuilder, NgForm, FormGroup } from '@angular/forms';
import { questionpdfarray } from '../../../models/questionpadfarray';
import { User } from '../../../models/user';

@Component({
  selector: 'app-userdisclaimer-control',
  templateUrl: './user-disclaimer.component.html',
  styleUrls: ['./user-disclaimer.component.scss']
})

export class UserDisclaimerComponent {
  section1para0: string;
  section2para0: string;
  section2para1: string;
  section2para2: string;
  section4para0: string;
  disclaimer: disclaimer;
  questionPdfArray: questionpdfarray[] = [];
  @Input() user: User;

  //Questions Store Variables
  questionLoadingIndicator$: Observable<boolean>;
  isQuestionsLoaded$: Observable<boolean>;
  selectQuestions$: Observable<questions[]>;
  //End Questions Store Variables


  constructor(private appService: AppService,
    private store$: Store<RootStoreState.State>,
    private pdfService: PdfService) { }

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
    this.loadData();
  }
  async loadData() {
    this.selectQuestions$.subscribe(data => {
      if (data && data.length>0) {
        for (var i = 0; i < data.length; i++) {
          let questionArray: questionpdfarray = new questionpdfarray(data[i].id, data[i].question, this.getQuestionIsActive(data[i].id))
          this.questionPdfArray.push(questionArray)
        }
      }
    })

  }
  getQuestionIsActive(id: string): string {
    var returnValue: string = "NOT ANSWRED";
    //if (typeof this.user.userquestions !=='undefined') {
    if (this.user && this.user.hasOwnProperty('userquestions')) {
      if (this.user.userquestions.length > 0) {
        var strArr = this.user.userquestions.filter(a => a.questionid == id);
        if (strArr) {
          returnValue = strArr[0].accepted ? "YES" : "NO";
        }
      }
    }
    return returnValue;
  }
  setSections() {
    if (this.disclaimer) {
      this.section1para0 = this.disclaimer.section1["para"][0];
      this.section2para0 = this.disclaimer.section2["para"][0];
      this.section2para1 = this.disclaimer.section2["para"][1];
      this.section2para2 = this.disclaimer.section2["para"][2];
      this.section4para0 = this.disclaimer.section3["para"][0];
    }
  }


  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': this.pdfService.generatePdf(documentDefinition); break;
    }
  }

  getDocumentDefinition() {
    //var html = htmlToPdfmake(this.disclaimerTxt);
    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: 'AGREEMENT FOR\nURBANHOOD SERVICES',
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Sections 1: Usage-Based Services/Nonprofessional Subscriber Status',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        }
        ,
        {
          text: this.section1para0,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Sections 2: Trems and Conditions',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        {
          text: this.section2para0,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: this.section2para1,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: this.section2para2,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: "Accepted Terms and Condition: " + this.user.userdisclaimer.accepted ? "Yes" : "No",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Sections 3: Questions',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        this.getQuestions(this.questionPdfArray),
        {
          text: '\nSections 4: Certification',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        {
          text: this.section4para0,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: this.user.userdisclaimer.accepted ? "I Agree" : "I Disagree",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        }
        //,
        //{
        //  text: 'AGREEMENT FOR\nURBANHOOD SALES',
        //  fontSize: 20,
        //  alignment: 'center',
        //  pageBreak: 'before',
        //  margin: [0, 0, 0, 20]
        //},
      ]
    };
  }

  getQuestions(questionArray: questionpdfarray[]) {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [{
            text: 'Question',
            style: 'tableHeader'
          },
          {
            text: 'Result',
            style: 'tableHeader'
          },
          ],
          ...questionArray.map(ed => {
            return [ed.question, ed.result];
          })
        ]
      }
    };
  }
}
