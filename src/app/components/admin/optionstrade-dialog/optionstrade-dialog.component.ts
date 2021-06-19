// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions, PermissionsStoreSelectors, PermissionsStoreActions } from '@app/store';
import { Observable } from 'rxjs';
//import { User } from 'firebase';
import { AccountService } from '@app/services';
import { User } from '@app/models/user';
import { optionstrade } from '../../../models';
import { OptionsTradeEditorComponent } from '../optionstrade-editor/optionstrade-editor.component';



@Component({
  selector: 'app-optionstrade-dialog',
  templateUrl: 'optionstrade-dialog.component.html',
  styleUrls: ['optionstrade-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditOptionsTradeDialogComponent implements AfterViewInit {
  @ViewChild(OptionsTradeEditorComponent, { static: true })
  editOptionsTrade: OptionsTradeEditorComponent;

  collect$: Observable<any>;
  get tickerSymbol(): any {
    return this.data.ticker ? { name: this.data.ticker.symbol } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditOptionsTradeDialogComponent>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade }, private store$: Store<RootStoreState.State>) {
  }


  ngAfterViewInit() {
    this.editOptionsTrade.tickerSaved$.subscribe(ticker => this.dialogRef.close(ticker));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
