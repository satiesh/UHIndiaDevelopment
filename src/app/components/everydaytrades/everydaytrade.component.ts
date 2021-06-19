// =============================
// Email: satish@urbanhood.org
// urbanhood.org 
// =============================

import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService, AccountService, fadeInOut, MessageSeverity, Utilities, AuthService } from '@app/services';
import { Permission, optionstrade } from '@app/models/';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreSelectors, OptionsTradeStoreActions } from '@app/store';
import { EditOptionsTradeDialogComponent, OptionsTradeCommentComponent, OptionsTradeViewComponent } from '@app/components/';
import { Router } from '@angular/router';
import { EveryDayTradeViewComponent } from './everydaytradeview.component';
import { OpenOptionTradeViewComponent } from './openoptiontradeview.component';
import { ClosedOptionTradeViewComponent } from './closedoptiontradeview.component';
import { ClosedStockTradesComponent } from './closedstocktrades.component';
import { OpenStockTradeViewComponent } from './openstocktradeview.component';
import { ClosedStockViewComponent } from './closedstockview.component';

@Component({
  selector: 'app-everydaytrade-list',
  templateUrl: './everydaytrade.component.html',
  styleUrls: ['./everydaytrade.component.scss'],
  animations: [fadeInOut]
})

export class EveryTradeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['symbol', 'postedby', 'tradetype', 'createdon'];
  //displayedColumns = ['symbol', 'postedby','tradetype','createdon','isactive'];
  dataSource: MatTableDataSource<optionstrade>;
  sourceOptionsTrade: optionstrade;

  loadingIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade[]>;
  recordFound: boolean = false;
  @Input() dailyOptionTrade: optionstrade[];


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService:AuthService,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>,
    private router: Router) {


    if (this.canManageDailyTrade || this.canViewOptionTrade || this.canManageOptionTrade) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    //this.loadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    //this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    //this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradeByTodaysDate(this.authService.groupInfo));

    this.loadData();
  }

  async loadData() {
    this.onDataLoadSuccessful(this.dailyOptionTrade);
    //await this.isOptionsTradeLoaded$.subscribe((result: boolean) => {
    //  if (!result) {
    //    this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
    //  }
    //  else {
    //    this.selectOptionsTrade$.subscribe(
    //      optionstrade => this.onDataLoadSuccessful(optionstrade),
    //      error => this.onDataLoadFailed(error)
    //    );
    //  }
    //});
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
    this.dataSource.data = optionstrade;
    if (optionstrade.length > 0) {
      this.recordFound = true;
    }

  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  AddComments(ticker?: optionstrade, addAdditionalComments?: boolean) {
    this.sourceOptionsTrade = ticker;
    if (!addAdditionalComments) {
      const dialogRef = this.dialog.open(OptionsTradeCommentComponent,
        {
          panelClass: 'mat-dialog-lg',
          disableClose: true,
          data: { ticker, addAdditionalComments }
        });
      dialogRef.afterClosed().subscribe(u => {
        if (u) {
          console.log("After close" + u);
          //this.updateUsers(u);
        }
      });
    }
    else if (addAdditionalComments) {
      const dialogRef = this.dialog.open(OptionsTradeCommentComponent,
        {
          panelClass: 'mat-dialog-lg',
          disableClose: true,
          data: { ticker, addAdditionalComments }
        });
      dialogRef.afterClosed().subscribe(u => {
        if (u) {
          console.log("After close" + u);
        }
      });
    }
  }

  newTrade() {
    this.router.navigateByUrl('auth/admin/newtrade');
  }

  editOptionsTrade(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(EditOptionsTradeDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
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
  }

  ViewComments(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(EveryDayTradeViewComponent,
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

  ViewOpenOptionComments(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(OpenOptionTradeViewComponent,
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

  ViewClosedOptionComments(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(ClosedOptionTradeViewComponent,
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

  ViewOpenStockComments(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(OpenStockTradeViewComponent,
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


  ViewClosedStockComments(ticker?: optionstrade) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(ClosedStockViewComponent,
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

  checkDate(dateData: any) {
    var dateWrapper = new Date(dateData);
    if (isNaN(dateWrapper.getDate())) {
      return Utilities.transformSecondsToDate(dateData);
    }
    else {
      return dateData;
    }
  }

  get canViewOptionTrade() {
    return this.accountService.userHasPermission(Permission.viewOptionTrade);
  }
  
  get canManageOptionTrade() {
    return this.accountService.userHasPermission(Permission.manageOptionTrade);
  }

  get canManageDailyTrade() {
    return this.accountService.userHasPermission(Permission.manageDailyTrade);
  }

}
