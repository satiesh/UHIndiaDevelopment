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
import { Permission, coupons } from '@app/models/';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootStoreState, UsersStoreSelectors, UsersStoreActions, CoursesStoreActions } from '@app/store';
import { EditUserDialogComponent } from '@app/components/admin/user-dialog/user-dialog.component';
import { User } from '@app/models/user';
import { NewUserDialogComponent } from '../user-new-dialog/user-new-dialog.component';
import { CouponStoreSelectors, CouponStoreActions } from '../../../store/coupon-data';
import { EditCouponDialogComponent } from '../coupon-dialog/coupon-dialog.component';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss'],
  animations: [fadeInOut]
})

export class CouponListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['name', 'discounteditem', 'expiresOn', 'type', 'value', 'isactive'];
  dataSource: MatTableDataSource<coupons>;
  sourceCoupon: coupons;

  loadingIndicator$: Observable<boolean>;
  isCouponsLoaded$: Observable<boolean>;
  selectCoupons$: Observable<coupons[]>;


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {


    if (this.canManageCoupons) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {

    this.loadingIndicator$ = this.store$.select(CouponStoreSelectors.selectCouponsLoading);
    this.isCouponsLoaded$ = this.store$.select(CouponStoreSelectors.selectCouponsLoaded);
    this.selectCoupons$ = this.store$.select(CouponStoreSelectors.selectCoupons);
    this.loadData();
  }

  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }

  async loadData() {

    await this.isCouponsLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CouponStoreActions.CouponRequestAction());
      }
      else {
        this.selectCoupons$.subscribe(
          coupons => this.onDataLoadSuccessful(coupons),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, header) => data[header];
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(couponData: coupons[]) {
    this.alertService.stopLoadingMessage();
    this.dataSource.data = couponData;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }
  newUser(user?: User) {
    const dialogRef = this.dialog.open(NewUserDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { user: user, updateFromUserList: true }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  editCoupon(coupon?: coupons) {
    const dialogRef = this.dialog.open(EditCouponDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { coupon: coupon }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }
  reloadCoupons() {
    this.store$.dispatch(new CouponStoreActions.CouponRequestAction());
    this.selectCoupons$.subscribe(
      users => this.onDataLoadSuccessful(users),
      error => this.onDataLoadFailed(error)
    );
  }

  confirmDelete(coupon: coupons) {

    this.snackBar.open(`Delete ${coupon.name}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.store$.dispatch(new CouponStoreActions.DeleteCouponRequestAction(coupon))
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            if (!loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  get canManageCoupons() {
    return this.accountService.userHasPermission(Permission.manageCoupons);
  }

  get canViewCoupons() {
    return this.accountService.userHasPermission(Permission.viewCoupons);
  }


}
