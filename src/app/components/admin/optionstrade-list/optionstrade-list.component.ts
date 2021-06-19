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
import { AlertService, AccountService, fadeInOut, MessageSeverity, Utilities } from '@app/services';
import { Permission, optionstrade } from '@app/models/';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreSelectors, OptionsTradeStoreActions } from '@app/store';
import { EditOptionsTradeDialogComponent, OptionsTradeCommentComponent } from '@app/components/';
import { Router } from '@angular/router';
import { StockTradeCommentComponent } from '../optionstrade-editor/stocktrade-comment.component';

@Component({
  selector: 'app-optionstrade-list',
  templateUrl: './optionstrade-list.component.html',
  styleUrls: ['./optionstrade-list.component.scss'],
  animations: [fadeInOut]
})

export class OptionsTradeListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
 // @Input() allTradeData: optionstrade[];

  //displayedColumns = ['symbol', 'postedby', 'type', 'createdon'];
  displayedColumns = ['symbol', 'postedby', 'createdon'];
  dataSource: MatTableDataSource<optionstrade>;
  sourceOptionsTrade: optionstrade;
  recordFound: boolean = false;

  loadingIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade[]>;


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store$: Store<RootStoreState.State>,
    private router: Router) {


    if (this.canManageOptionTrade) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTrades);

    this.loadData();
  }

  async loadData() {
  //  if (this.allTradeData.length <= 0) {
      await this.isOptionsTradeLoaded$.subscribe((result: boolean) => {
        if (!result) {
          this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
        }
        else {
          this.selectOptionsTrade$.subscribe(
            optionstrade => this.onDataLoadSuccessful(optionstrade),
            error => this.onDataLoadFailed(error)
          );
        }
      });
    //}
    //else {
    //  this.onDataLoadSuccessful(this.allTradeData);
    //}
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(optionstrade: optionstrade[]) {
    this.recordFound = true;
    this.alertService.stopLoadingMessage();
    this.dataSource.data = optionstrade;
  }

  private onDataLoadFailed(error: any) {
    this.recordFound = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }


  AddOptionComments(ticker?: optionstrade, addAdditionalComments?: boolean) {
    this.sourceOptionsTrade = ticker;
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

  AddStockComments(ticker?: optionstrade, addAdditionalComments?: boolean) {
    this.sourceOptionsTrade = ticker;
    const dialogRef = this.dialog.open(StockTradeCommentComponent,
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

  confirmDelete(ticker?: optionstrade) {

    this.snackBar.open(`Delete ${ticker.symbol}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.store$.dispatch(new OptionsTradeStoreActions.DeleteOptionsTradeRequestAction(ticker))
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            if (!loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  reloadOptions() {
    this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
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

  get canDeleteOptionTrade() {
    return this.accountService.userHasPermission(Permission.deleteOptionTrade);
  }
}
