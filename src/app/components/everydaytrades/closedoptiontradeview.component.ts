// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

import {
  AlertService,
  MessageSeverity, AppTranslationService, AuthService, AppService, Utilities
} from '@app/services';

import { channel, channeldisplay, optionstrade, transdatadisplay } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreActions, ChannelStoreSelectors, ChannelStoreActions, OptionsTradeStoreSelectors, CurrentUsersStoreActions, CurrentUsersStoreSelectors, UserOptionTradeStoreSelectors, UserOptionTradeStoreActions, UsersStoreSelectors, UsersStoreActions } from '@app/store';
import { MatTableDataSource } from '@angular/material/table';
import { optionstradenotes } from '@app/models/optionstradenotes';
import { User } from '@app/models/user';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { useroptiontrades } from '@app/models/useroptiontrade';
import { UsersOptionsTradeRequestAction } from '../../store/user-data/user-data.action';

@Component({
  selector: 'app-closedoptiontrade-view-comment',
  templateUrl: './closedoptiontradeview.component.html',
  styleUrls: ['./closedoptiontradeview.component.scss']
})
export class ClosedOptionTradeViewComponent implements OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('form', { static: true })
  private form: NgForm;

  currentContextUser: User;
  public isSaving = false;
  private onOptionsTradeSaved = new Subject<optionstrade>();
  @Input() ticker: optionstrade = new optionstrade();
  
  optUserOptionSelected: useroptiontrades;
  optUserStockSelected: useroptiontrades;
  loadingUserOptionTradeIndicator$: Observable<boolean>;
  isUserOptionTradeLoaded$: Observable<boolean>;
  selectUserOptionTrade$: Observable<useroptiontrades[]>;
  ouseroptiontrades: useroptiontrades[];

  loadingIndicator: boolean;
  isOptionsTradeLoaded$: Observable<boolean>;

  displayedColumns = ['notestype', 'notesvalue', 'notespostedby', 'createdon'];
  dataSource: MatTableDataSource<optionstradenotes>;

  transDisplayedColumns = [];
  transDataSource: MatTableDataSource<transdatadisplay>;

  everydaytradeform: FormGroup;

  constructor(
    private alertService: AlertService,
    private appService: AppService,
    public dialogRef: MatDialogRef<ClosedOptionTradeViewComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade },
    private store$: Store<RootStoreState.State>
  ) {

    this.dataSource = new MatTableDataSource();
    this.transDataSource = new MatTableDataSource();

    this.ticker = data.ticker;
    this.dataSource.data = this.ticker.notes;

    switch (this.ticker.spread) {
      case 'DEBIT SPREAD':
      case 'CREDIT SPREAD':
        this.transDisplayedColumns.push('strikeprice', 'strikeprice2', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'SINGLE':
        this.transDisplayedColumns.push('strikeprice', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'COVERED CALLS':
        this.transDisplayedColumns.push('strikeprice', 'strikeprice2', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'CALENDER':
        this.transDisplayedColumns.push('strikeprice', 'premiumpaid', 'transtype', 'expdate', 'selllegexpdate');
        break;
    }
    this.transDataSource.data = this.ticker.trans;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
  }

  checkDate(dateData: any) {
    var dateWrapper = new Date(dateData);
    if (isNaN(dateWrapper.getDate())) {
      return Utilities.transformSecondsToDate(dateData);
    }
    else {
      return dateData;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }


}
