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
import { AlertService, AccountService, fadeInOut, MessageSeverity, Utilities } from '@app/services';
import { Permission, dailyticker } from '@app/models/';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, DailyTradeStoreSelectors, DailyTradeStoreActions } from '@app/store';

@Component({
  selector: 'app-freestockofday-list',
  templateUrl: './freestockofday.component.html',
  styleUrls: ['./freestockofday.component.scss'],
  animations: [fadeInOut]
})

export class FreeStockOfDayComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['symbol', 'support', 'resistancetarget', 'stoploss', 'createdon','actions'];
  dataSource: MatTableDataSource<dailyticker>;
  sourceDailyTicker: dailyticker;
  recordFound: boolean = false;
  loadingIndicator$: Observable<boolean>;
  isDailyTickerLoaded$: Observable<boolean>;
  selectDailyTicker$: Observable<dailyticker[]>;


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(DailyTradeStoreSelectors.selectDailyTradesLoading);
    this.isDailyTickerLoaded$ = this.store$.select(DailyTradeStoreSelectors.selectDailyTradesLoaded);
    this.selectDailyTicker$ = this.store$.select(DailyTradeStoreSelectors.selectDailyTradeByTodaysDate());

    this.loadData();
  }

  async loadData() {

    await this.isDailyTickerLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new DailyTradeStoreActions.DailyTickerRequestAction());
      }
      else {
        this.selectDailyTicker$.subscribe(
          dailyticker => this.onDataLoadSuccessful(dailyticker),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(dailyticker: dailyticker[]) {
    this.recordFound = false;
    if (dailyticker.length > 0) {
      this.recordFound = true;
    }
    this.alertService.stopLoadingMessage();
    this.dataSource.data = dailyticker;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }
 
  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }
  reloadDailyTrade() {
    this.store$.dispatch(new DailyTradeStoreActions.DailyTickerRequestAction());
  }
  confirmDelete(ticker: dailyticker) {
    let message: string = ticker.isactive ? 'Deactivate ' + ticker.symbol + '?' : 'Activate ' + ticker.symbol + '?';
    let title: string = ticker.isactive ? 'DEACTIVATE' : 'ACTIVATE';
    let ndailyticker: dailyticker = new dailyticker(
      ticker.id, ticker.createdby, ticker.createdon, ticker.marketcap,
      ticker.notes, ticker.quote, ticker.resistancetarget, ticker.sector,
      ticker.stoploss, ticker.support, ticker.symbol, ticker.tradingpricerange,
      ticker.type, ticker.volume, ticker.isactive ? false : true
    );
    this.snackBar.open(message, title, { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Processing...');
        this.store$.dispatch(new DailyTradeStoreActions.DeleteDailyTickerRequestAction(ndailyticker))
        this.isDailyTickerLoaded$.subscribe(
          (loading: boolean) => {
            if (loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  get canManageStockOftheDay() {
    return this.accountService.userHasPermission(Permission.manageStockoftheday);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

}
