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
import { AlertService, AccountService, fadeInOut, MessageSeverity, Utilities, AuthService } from '@app/services';
import { Permission, optionstrade } from '@app/models/';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreSelectors, OptionsTradeStoreActions } from '@app/store';
import { EditOptionsTradeDialogComponent, OptionsTradeCommentComponent, OptionsTradeViewComponent } from '@app/components/';
import { Router } from '@angular/router';
import { EveryDayTradeViewComponent } from './everydaytradeview.component';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OpenStockTradeViewComponent } from './openstocktradeview.component';

@Component({
  selector: 'app-openstocktrades-list',
  templateUrl: './openstocktrades.component.html',
  styleUrls: ['./openstocktrades.component.scss'],
  animations: [fadeInOut]
})

export class OpenStockTradesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private form: NgForm;
  displayedColumns = ['symbol', 'postedby', 'tradetype', 'createdon'];
  //displayedColumns = ['symbol', 'postedby', 'tradetype', 'createdon', 'isactive'];
  dataSource: MatTableDataSource<optionstrade>;
  sourceOptionsTrade: optionstrade;

  loadingIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade[]>;
  recordFound: boolean = false;
  opentradeform: FormGroup;
  isValidDate: boolean = false;
  isEditMode: boolean = false;
  get fromdate() {
    return this.opentradeform.get('fromdate');
  }

  get todate() {
    return this.opentradeform.get('todate');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService:AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>,
    private router: Router) {


    if (this.canManageDailyTrade || this.canViewOptionTrade || this.canManageOptionTrade) {
         this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.buildForm();
  }

  ngOnInit() {
    var CurrentDate = new Date();
    var fromDate = new Date(CurrentDate.setMonth(CurrentDate.getMonth() -1));
    var toDate = new Date(CurrentDate.setMonth(CurrentDate.getMonth() + 3));
    this.fromdate.setValue(fromDate);
    this.todate.setValue(toDate);

    this.loadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectStockTradeByDate(fromDate, toDate, this.authService.groupInfo));

    this.loadData();
  }
  private buildForm() {
    let regEx = '^\\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\\.[0-9][0-9])?$';
    var resistancepattern = /^([0-9]+(.[0-9]+)*,*)+$/;
    this.opentradeform = this.formBuilder.group({
      fromdate: ['', Validators.required],
      todate: ['', Validators.required]
     });
  }

  public submitReport() {

    var fromDate = this.fromdate.value;
    var toDate = this.todate.value;
    if (!fromDate || !toDate) {
      this.alertService.showMessage("Data Missing", 'Please enter fromdate and todate to process the request.', MessageSeverity.error);
      return;
    }
    if (!this.validateDates(fromDate,toDate)) {
      this.alertService.showMessage("Data Missing", 'Please enter proper fromdate and todate to process the request.', MessageSeverity.error);
      return;
    }
    this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectStockTradeByDate(fromDate, toDate, this.authService.groupInfo));
   this.selectOptionsTrade$.subscribe(
      optionstrade => this.onDataLoadSuccessful(optionstrade),
      error => this.onDataLoadFailed(error)
    );
    console.log(fromDate, toDate);
  }

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate == null || eDate == null)) {
      //this.error = { isError: true, errorMessage: 'Start date and end date are required.' };
      this.isValidDate = false;
    }

    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      //this.error = { isError: true, errorMessage: 'End date should be grater then start date.' };
      this.isValidDate = false;
    }
    return this.isValidDate;
  }


  async loadData() {

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
