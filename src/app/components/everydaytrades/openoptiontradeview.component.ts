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
  selector: 'app-openoptiontrade-view-comment',
  templateUrl: './openoptiontradeview.component.html',
  styleUrls: ['./openoptiontradeview.component.scss']
})
export class OpenOptionTradeViewComponent implements OnDestroy, AfterViewInit {

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

  loadingTradingFeederIndicator$: Observable<boolean>;
  tradingFeederLoaded$: Observable<boolean>;
  tradingFeeder$: Observable<User[]>;

  optSelected: boolean = false;
  stkSelected: boolean = false;
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
  stockdataSource: MatTableDataSource<optionstradenotes>;

  transDisplayedColumns = [];
  transDataSource: MatTableDataSource<transdatadisplay>;

  everydaytradeform: FormGroup;

  get optionSection() {
    return this.everydaytradeform.get('optionSection');
  }

  get takeoption() {
    return this.optionSection.get('takeoption');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private appService: AppService,
    public dialogRef: MatDialogRef<OpenOptionTradeViewComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade },
    private store$: Store<RootStoreState.State>
  ) {

    this.dataSource = new MatTableDataSource();
    this.transDataSource = new MatTableDataSource();

    this.loadingCurrentUserIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);

  
    this.loadingUserOptionTradeIndicator$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeLoading);
    this.isUserOptionTradeLoaded$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeLoaded);

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
    this.loadData();
    this.buildForm();
  }
  async loadData() {
    await this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    })

    this.isUserOptionTradeLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new UserOptionTradeStoreActions.UsersOptionsTradeRequestAction({ uid: this.authService.currentUser.uid }));
      }
    });

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

  private buildForm() {
    this.everydaytradeform = this.formBuilder.group({
      optionSection: this.formBuilder.group({
        takeoption: ['']
      })
    });
    this.resetForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  public resetForm() {

    this.isUserOptionTradeLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectUserOptionTrade$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeById(this.ticker.id));
        this.selectUserOptionTrade$.subscribe(
          uoptionstrade => {
            if (uoptionstrade.length > 0) {
              this.ouseroptiontrades = uoptionstrade
              this.optUserOptionSelected = uoptionstrade.find(a => a.takeType === "option");
              if (this.optUserOptionSelected) {
                this.optSelected = this.optUserOptionSelected.pinned;   //uoptionstrade.find(a => a.takeType === "option").pinned;
              }
             }
            this.everydaytradeform.reset({
              optionSection: {
                takeoption: this.optSelected
              }
            });
          },
          error => this.onDataLoadFailed(error))
      }
    });


  }


  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
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

  save(): void {

    if (this.optSelected === this.takeoption.value) {
      this.alertService.showMessage("Message", 'No change hs been made to save the data.', MessageSeverity.error);
      return;
    }

    var currentUserName = this.currentContextUser.userprofile.firstName + ' ' + this.currentContextUser.userprofile.lastName;
    var date = new Date();
    var postData: boolean = false;
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const optionModel = this.optionSection.value;
    let ouseroptiontrade: useroptiontrades;
    if (this.optUserOptionSelected) {
      if (!optionModel.takeoption) {
        ouseroptiontrade= new useroptiontrades(
          this.optUserOptionSelected.id, this.authService.currentUser.uid, this.ticker.id, optionModel.takeoption, new Date(now_utc),
          this.authService.currentUser.uid, "option", this.ticker.symbol, this.ticker.createdon, this.ticker.postedby);
        this.store$.dispatch(new UserOptionTradeStoreActions.UpdateUsersOptionsTradeRequestAction(ouseroptiontrade));
      }
    }
    else {
      if (optionModel.takeoption) {
        var date = new Date();
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
          date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        ouseroptiontrade = new useroptiontrades(
          this.appService.getNewDocId(), this.authService.currentUser.uid, this.ticker.id, optionModel.takeoption, new Date(now_utc),
          this.authService.currentUser.uid, "option", this.ticker.symbol, this.ticker.createdon, this.ticker.postedby);
        this.store$.dispatch(new UserOptionTradeStoreActions.AddUsersOptionsTradeRequestAction(ouseroptiontrade));
      }
    }
    //this.store$.dispatch(new UserOptionTradeStoreActions.UsersOptionsTradeRequestAction({ uid: this.authService.currentUser.uid }));
    //this.resetForm();
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }


}
