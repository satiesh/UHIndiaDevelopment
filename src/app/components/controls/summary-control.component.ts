import { Component } from '@angular/core';

@Component({
  selector: 'app-summary-control',
  templateUrl: './summary-control.component.html',
  styleUrls: ['./summary-control.component.scss']
})

export class SummaryControlComponent {
  firstname: string;
  emailaddress: string;
  referenceid: string;
  enablePaymentStep: boolean;
  isNewSetup: boolean = true;
  isExistingUser: boolean = false;
  constructor() { }
}
