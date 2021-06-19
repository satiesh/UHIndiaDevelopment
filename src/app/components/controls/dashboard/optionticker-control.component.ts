// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService, AppTranslationService, AccountService, fadeInOut, MessageSeverity, Utilities, AppService, AuthService } from '@app/services';
import { Permission, Roles, optionstrade, useroptiontradedisplay } from '@app/models/';
import { Observable, interval } from 'rxjs';
import { User } from 'firebase';
import { Store, select } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreSelectors, OptionsTradeStoreActions, UsersStoreSelectors, UserOptionTradeStoreSelectors, UserOptionTradeStoreActions } from '@app/store';
import { EditOptionsTradeDialogComponent, OptionsTradeCommentComponent, OptionsTradeViewComponent } from '@app/components/';
import { useroptiontrades } from '../../../models/useroptiontrade';
import { startWith, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-optionticker-control',
  templateUrl: './optionticker-control.component.html',
  styleUrls: ['./optionticker-control.component.scss'],
  animations: [fadeInOut]
})

export class OptionsTickerListComponent implements OnInit, AfterViewInit {
  private sort: MatSort;
  private paginator: MatPaginator;



  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }



  displayedColumns = ['symbol', 'postedby', 'type', 'createdon'];
  dataSource: MatTableDataSource<useroptiontradedisplay>;
  sourceOptionsTrade: optionstrade;
  loadingIndicator: boolean;
  ouseroptiontradedisplay: useroptiontradedisplay[];

  loadingIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade[]>;

  loadingUserOptionTradeIndicator$: Observable<boolean>;
  isUserOptionTradeLoaded$: Observable<boolean>;
  selectUserOptionTrade$: Observable<useroptiontrades[]>;
  ouseroptiontrades: useroptiontrades[];

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService: AuthService,
    private appService: AppService,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {
    // Assign the data to the data source for the table to render
    if (this.canViewOptionTrade) {
      this.displayedColumns.push('actions');
    }
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradeByTodaysDate(this.authService.groupInfo));

    this.loadingUserOptionTradeIndicator$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeLoading);
    this.isUserOptionTradeLoaded$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeLoaded);
    this.selectUserOptionTrade$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTrade);
    this.loadData();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadData() {
    this.isOptionsTradeLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
        this.store$.dispatch(new UserOptionTradeStoreActions.UsersOptionsTradeRequestAction({ uid: this.authService.currentUser.uid }));
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            this.SetLoadingIndicator(loading)
          });
        this.selectOptionsTrade$.subscribe(
          optionstrade => this.onDataLoadSuccessful(optionstrade),
          error => this.onDataLoadFailed(error)
        );

      }
      else {
        this.selectOptionsTrade$.subscribe(
          optionstrade => this.onDataLoadSuccessful(optionstrade),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }


  private SetLoadingIndicator(loading: boolean) {
    if (loading) {
      this.loadingIndicator = loading;
    }
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(optionstrade: optionstrade[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.isUserOptionTradeLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectUserOptionTrade$.subscribe(
          uoptionstrade => {
            this.ouseroptiontrades = uoptionstrade
            this.loadTableData(optionstrade);
          },
          error => this.onDataLoadFailed(error))
      }
    });
  }
  loadTableData(optionstrade: optionstrade[]) {
    this.ouseroptiontradedisplay = []
    for (var i = 0; i < optionstrade.length; i++) {
      let souseroptiontradedisplay: useroptiontradedisplay = new
        useroptiontradedisplay(optionstrade[i].id,
          optionstrade[i].symbol,
          optionstrade[i].createdby,
          optionstrade[i].createdon,
          false,
          optionstrade[i].notes,
          optionstrade[i].postedby,
          optionstrade[i].trans,
          optionstrade[i].type,
          optionstrade[i].isactive
        );
      this.isPinned(souseroptiontradedisplay);
    }
    this.dataSource.data = this.ouseroptiontradedisplay;
  }

  isPinned(souseroptiontradedisplay: useroptiontradedisplay) {
    if (this.ouseroptiontrades && this.ouseroptiontrades.length > 0) {
      var obj = this.ouseroptiontrades.find(a => a.optiontradeid == souseroptiontradedisplay.id);
      if (obj) {
        souseroptiontradedisplay.pinned = obj.pinned;
        souseroptiontradedisplay.useroptiontradeid = obj.id;
      }
    }
    this.ouseroptiontradedisplay.push(souseroptiontradedisplay);
    //return souseroptiontradedisplay;
  }

  togglePin(row: useroptiontradedisplay) {
    const pin = !row.pinned;
    row.pinned = pin;
    if (pin && !row.useroptiontradeid) {
      var date = new Date();
      var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      let ouseroptiontrade: useroptiontrades = new useroptiontrades(
        this.appService.getNewDocId(), this.authService.currentUser.uid, row.id, pin, new Date(now_utc), this.authService.currentUser.uid);
      this.store$.dispatch(new UserOptionTradeStoreActions.AddUsersOptionsTradeRequestAction(ouseroptiontrade));
    }
    else {
      let ouseroptiontrade: useroptiontrades = new useroptiontrades(
        row.useroptiontradeid, this.authService.currentUser.uid, row.id, pin, new Date(now_utc), this.authService.currentUser.uid);
      this.store$.dispatch(new UserOptionTradeStoreActions.UpdateUsersOptionsTradeRequestAction(ouseroptiontrade));
    }
  }


  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  ViewComments(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(OptionsTradeViewComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { ticker }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  editOptionsTrade(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(EditOptionsTradeDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { ticker }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }
  reloadOptions() {
    this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
    this.selectOptionsTrade$.subscribe(
      optionstrade => this.onDataLoadSuccessful(optionstrade),
      error => this.onDataLoadFailed(error)
    );
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
  confirmDelete(ticker: optionstrade) {

    //let message: string = ticker.isactive ? 'Deactivate ' + ticker.symbol + '?' : 'Activate ' + ticker.symbol + '?';
    //let title: string = ticker.isactive ? 'DEACTIVATE' : 'ACTIVATE';
    //let noptionstrade: optionstrade = new optionstrade(
    //  ticker.id, ticker.createdby, ticker.createdon, ticker.marketcap,
    //  ticker.notes, ticker.quote, ticker.resistancetarget, ticker.sector,
    //  ticker.stoploss, ticker.support, ticker.symbol, ticker.tradingpricerange,
    //  ticker.type, ticker.volume, ticker.isactive ? false : true
    //);
    //this.snackBar.open(message, title, { duration: 5000 })
    //  .onAction().subscribe(() => {
    //    this.alertService.startLoadingMessage('Deleting...');
    //    this.loadingIndicator = true;
    //    this.store$.dispatch(new OptionsTradeStoreActions.DeleteOptionsTradeRequestAction(noptionstrade))
    //    this.loadingIndicator$.subscribe(
    //      (loading: boolean) => {
    //        if (!loading) {
    //          this.alertService.stopLoadingMessage();
    //          this.loadingIndicator = false;
    //        }
    //      });

    //this.accountService.deleteUser(user)
    //  .subscribe(results => {
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;
    //    this.dataSource.data = this.dataSource.data.filter(item => item !== user);
    //  },
    //    error => {
    //      this.alertService.stopLoadingMessage();
    //      this.loadingIndicator = false;

    //      this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
    //        MessageSeverity.error, error);
    //    });
    //});
  }


  get canViewOptionTrade() {
    return this.accountService.userHasPermission(Permission.viewOptionTrade);
  }

  get canManageOptionTrade() {
    return this.accountService.userHasPermission(Permission.manageOptionTrade);
  }

}
