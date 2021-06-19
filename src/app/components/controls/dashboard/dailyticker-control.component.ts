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
import { AlertService, AppTranslationService, AccountService, fadeInOut, MessageSeverity, Utilities } from '@app/services';
import { Permission, Roles, dailyticker } from '@app/models/';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions, DailyTradeStoreSelectors, DailyTradeStoreActions } from '@app/store';
import { EditRoleDialogComponent } from '@app/components/admin/role-dialog/role-dialog.component';

@Component({
  selector: 'app-dailyticker',
  templateUrl: './dailyticker-control.component.html',
  styleUrls: ['./dailyticker-control.component.scss'],
  animations: [fadeInOut]
})

export class DailyTickerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['symbol', 'support', 'type', 'tradingpricerange', 'stoploss','actions'];
  dataSource: MatTableDataSource<dailyticker>;
  sourceDailyTicker: dailyticker;
  loadingIndicator: boolean;

  loadingIndicator$: Observable<boolean>;
  isDailyTickerLoaded$: Observable<boolean>;
  selectDailyTicker$: Observable<dailyticker[]>;


  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
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
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            this.SetLoadingIndicator(loading)
          });
        this.selectDailyTicker$.subscribe(
          dailyticker => this.onDataLoadSuccessful(dailyticker),
          error => this.onDataLoadFailed(error)
        );

      }
      else {
        this.selectDailyTicker$.subscribe(
          dailyticker => this.onDataLoadSuccessful(dailyticker),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }

  reloadDailyTickers() {
    this.store$.dispatch(new DailyTradeStoreActions.DailyTickerRequestAction());

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


  private onDataLoadSuccessful(dailyticker: dailyticker[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.dataSource.data = dailyticker;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }
  editRole(dailyticker?: dailyticker) {
    this.sourceDailyTicker = dailyticker;
    const dialogRef = this.dialog.open(EditRoleDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { dailyticker }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  confirmDelete(dailyticker: dailyticker) {

    this.snackBar.open(`Delete ${dailyticker.symbol}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

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
      });
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
