import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(documentDefinition:any) {

    await this.loadPdfMaker();

    //const def = { content: 'A sample PDF document generated using Angular and PDFMake' };
    this.pdfMake.createPdf(documentDefinition).open();
  }

  async generateBase64Pdf(documentDefinition: any){
    var base64data: any;
    await this.loadPdfMaker();

    //const def = { content: 'A sample PDF document generated using Angular and PDFMake' };
    const pdfDocGenerator =await this.pdfMake.createPdf(documentDefinition);
    await pdfDocGenerator.getBase64((data) => { base64data = data; console.log("here " + base64data)});
    return base64data;
  }


}
