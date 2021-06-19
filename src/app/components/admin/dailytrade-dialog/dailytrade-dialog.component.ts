// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { RootStoreState} from '@app/store';
import { Observable } from 'rxjs';
import { AccountService } from '@app/services';
import { dailyticker } from '../../../models';
import { DailyTradeEditorComponent } from '../..';


@Component({
  selector: 'app-dailytrade-dialog',
  templateUrl: 'dailytrade-dialog.component.html',
  styleUrls: ['dailytrade-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditDailyTradeDialogComponent implements AfterViewInit {
  @ViewChild(DailyTradeEditorComponent, { static: true })
  editDailyTrade: DailyTradeEditorComponent;

  collect$: Observable<any>;
  get tickerSymbol(): any {
    return this.data.ticker? { name: this.data.ticker.symbol} : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditDailyTradeDialogComponent>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: dailyticker }, private store$: Store<RootStoreState.State>) {
  }


  ngAfterViewInit() {
    this.editDailyTrade.tickerSaved$.subscribe(ticker => this.dialogRef.close(ticker));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
