import { Component, ViewChild } from '@angular/core';
import { PdfService } from '../../services';
import { DisclaimerControlComponent } from './disclaimer-control.component';
//import { htmlToPdfmake } from 'html-to-pdfmake';
@Component({
  selector: 'app-pdf-control',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent {
  logo: string = '';
  disclaimerTxt: string = '';
  @ViewChild(DisclaimerControlComponent, { static: true }) disclaimerControl: DisclaimerControlComponent;

  constructor(private pdfService: PdfService) { }


  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': this.pdfService.generatePdf(documentDefinition); break;
      //case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      //case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      //default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  getDocumentDefinition() {
    //var html = htmlToPdfmake(this.disclaimerTxt);
    let polyline = {
      type: 'polyline',
      lineWidth: 1,
      closePath: true,
      points: [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 20 }, { x: 0, y: 20 }]
    }
    return {
      content:[ {
        text: 'AGREEMENT FOR\nURBANHOOD SERVICES',
        //bold: true,
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
          text: 'Urban Hood (Vendor) agrees to make "Trade Related Educational Information" (TREI) available to you pursuant to the terms and conditions set forth in this agreement. By executing this Agreement in the space indicated below, you ("Subscriber") agree to comply with those terms and conditions. Section 1 sets forth terms and conditions of general applicability. Section 2 applies insofar as Subscriber receives and uses TREI made available pursuant to this Agreement as a Nonprofessional Subscriber.',
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
          text: "The information shared by Urban Hood is based on what we've learned as stock traders and on using paid stock trading services.It may contain errors and you should not base investment decisions solely on what you read here.It's your money and your responsibility to be fully informed and responsible.",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: "Nothing herein should be considered personalized investment advice. Although our team may answer general customer service questions, they are not licensed to address your particular investment situation. Our track record is based on hypothetical results and may not reflect the same results as actual trades. Likewise, past performance is no guarantee of future returns. Certain investments carry large potential rewards, but also large potential risk. Don't trade in these markets with money you can't afford to lose. Urban Hood expressly forbids its writers and educators from having a financial interest in their own securities or commodities recommendations to readers. Such recommendations may be traded, however, by other editors, Urban Hood, its affiliated entities, employees, and agents, but only after waiting 24 hours after an internet broadcast or 72 hours after a publication only circulated through the mail.",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        {
          text: "© 2020 Urban Hood. All Rights Reserved. Protected by copyright laws of the United States and treaties.",
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
        {
          text: 'Sections 4: Certification',
          decoration: 'underline',
          fontSize: 15,
          alignment: 'left',
          margin: [0, 0, 0, 20]
        }, 
        {
          text: "By executing this Agreement, Subscriber hereby certifies that he or she falls within Paragraph 9's definition of \"Nonprofessional Subscriber\" and that the personal and employment information that he or she has included in Paragraph 12 is truthful and accurate.",
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 0, 0, 20]
        },
        ]
    };
  }


  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.logo = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
}
