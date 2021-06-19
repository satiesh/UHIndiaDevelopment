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
import { RootStoreState, OptionsTradeStoreActions, ChannelStoreSelectors, ChannelStoreActions, OptionsTradeStoreSelectors, CurrentUsersStoreActions, CurrentUsersStoreSelectors } from '@app/store';
import { MatTableDataSource } from '@angular/material/table';
import { broadcastinfo } from '../../../models/broadcastinfo';
import { optionstradenotes } from '../../../models/optionstradenotes';
import { User } from '../../../models/user';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-optionstrade-view-comment',
  templateUrl: './optiontrade-view.component.html',
  styleUrls: ['./optiontrade-view.component.scss']
})
export class OptionsTradeViewComponent implements OnChanges, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('form', { static: true })
  private form: NgForm;

  currentContextUser: User;
  public isSaving = false;
  private onOptionsTradeSaved = new Subject<optionstrade>();
  @Input() ticker: optionstrade = new optionstrade();
  @Input() isEditMode = false;


  loadingCurrentUserIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User[]>;
  
  loadingIndicator: boolean;
  isOptionsTradeLoaded$: Observable<boolean>;

  displayedColumns = ['notestype', 'notesvalue', 'notespostedby', 'createdon'];
  dataSource: MatTableDataSource<optionstradenotes>;

  transDisplayedColumns = ['strikeprice', 'premiumpaid', 'transtype', 'expdate'];
  transDataSource: MatTableDataSource<transdatadisplay>;

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    public dialogRef: MatDialogRef<OptionsTradeViewComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade},
    private store$: Store<RootStoreState.State>
  ) {

    this.dataSource = new MatTableDataSource();
    this.transDataSource = new MatTableDataSource();

    this.loadingCurrentUserIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);

    this.ticker = data.ticker;
    this.dataSource.data = this.ticker.notes;
    this.transDataSource.data = this.ticker.trans;
    this.loadData();
  }
  async loadData() {
    await this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    })
    await this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectCurrentUser$.subscribe((data: User[]) => {
          if (data) {
            this.currentContextUser = data[0];
          }
        })
      }
    });
  }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.ticker) {
    } else {
      this.ticker = new optionstrade();
    }
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
  public setUser(ticker?: optionstrade) {
    this.ticker = ticker;
    this.ngOnChanges();
  }

 
  assignNotes(newNotes: optionstradenotes[]): optionstrade {
    let dailytickeredit: optionstrade = new optionstrade();
    dailytickeredit.id = this.ticker.id;
    dailytickeredit.symbol = this.ticker.symbol;
    dailytickeredit.type = this.ticker.type;
    dailytickeredit.postedby = this.ticker.postedby;
    dailytickeredit.createdon = this.ticker.createdon;
    dailytickeredit.createdby = this.ticker.createdby;
    dailytickeredit.trans = this.ticker.trans;
    dailytickeredit.isactive =  this.ticker.isactive;
    let optionstradenotesarray: optionstradenotes[] = [];
    for (var i = 0; i < this.ticker.notes.length; i++) {
      let oOptionstradenotes: optionstradenotes = new optionstradenotes(
        this.ticker.notes[i].notestype, this.ticker.notes[i].notesvalue, this.ticker.notes[i].createdon, this.ticker.notes[i].notespostedby
      );
      optionstradenotesarray.push(oOptionstradenotes);
    }
    optionstradenotesarray.push(newNotes[0]);
    dailytickeredit.notes = optionstradenotesarray;
    return dailytickeredit;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }


}
