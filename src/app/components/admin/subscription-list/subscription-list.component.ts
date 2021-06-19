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
import { Permission, Roles, ServiceSubscription } from '@app/models/';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, SubscriptionStoreSelectors, SubscriptionStoreActions } from '@app/store';
import { EditSubscriptionDialogComponent } from '../subscription-dialog/subscription-dialog.component';


@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
  animations: [fadeInOut]
})

export class SubscriptonListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['Name', 'Description', 'IsActive', 'Price'];
  dataSource: MatTableDataSource<ServiceSubscription>;
  sourceSubscription: ServiceSubscription;
  
  loadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription[]>;


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {


    if (this.canManageSubscriptions) {
      this.displayedColumns.push('actions');
    }
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);
    this.selectSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptions);
    this.loadData();
  }

  async loadData() {

    await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) {this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());}
      else {
        this.selectSubscription$.subscribe(
          roles => this.onDataLoadSuccessful(roles),
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


  private onDataLoadSuccessful(subscription: ServiceSubscription[]) {
    this.alertService.stopLoadingMessage();
    this.dataSource.data = subscription;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  editCourse(subscription?: ServiceSubscription) {
    this.sourceSubscription = subscription;
    const dialogRef = this.dialog.open(EditSubscriptionDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { subscription }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  confirmDelete(subscription: ServiceSubscription) {

    this.snackBar.open(`Delete ${subscription.Name}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.store$.dispatch(new SubscriptionStoreActions.DeleteSubscriptionRequestAction(subscription))
        this.isSubscriptionLoaded$.subscribe(
          (loading: boolean) => {
            if (loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  reloadSubscription() {
    this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());
  }

  get canManageSubscriptions() {
    return this.accountService.userHasPermission(Permission.manageSubscriptions);
  }

  get canViewSubscriptions() {
    return this.accountService.userHasPermission(Permission.viewSubscriptions);
  }

}
