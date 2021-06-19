
import {Component, ViewChild} from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

/** @title Select with reset option */
@Component({
    selector: 'app-portfolio-control',
    templateUrl: './portfolio-control.component.html',
    styleUrls: ['./portfolio-control.component.scss']
})
export class PortfolioControlComponent {
    @ViewChild('form', { static: true })
  private form: NgForm;
  userProtfolioForm: FormGroup;
  
    portfoliosize: string[] = ['< $25,000', '$25,000 - $50,000', '$50,000 - $100,000', '$100,000 >'];
    portfoliotype: string[] = ['Aggressive', 'Defensive', 'Income', 'Speculative','Hybrid'];
    currentTradeTypes: string[] = ['Futures', 'Forex','Stocks', 'Options'];
  
save(){}
}