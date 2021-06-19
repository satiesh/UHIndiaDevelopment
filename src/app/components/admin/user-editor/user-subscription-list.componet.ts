// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { OnInit, Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { fadeInOut, AlertService, AppTranslationService, AccountService, Utilities } from '../../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RootStoreState, CoursesStoreSelectors, SubscriptionStoreSelectors, SubscriptionStoreActions, CoursesStoreActions, UsersStoreSelectors } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ServiceSubscription, userpaymentdisplay, subscriptions, usersubscriptiondisplay } from '@app/models';
import { User } from '@app/models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserSubscriptionCancelComponent } from './user-subscription-cancel.component';
import { UserSubscriptionChangeComponent } from './user-subscription-change.component';


@Component({
  selector: 'app-user-subscription-list',
  templateUrl: './user-subscription-list.component.html',
  styleUrls: ['./user-subscription-list.component.scss'],
  animations: [fadeInOut]
})

export class UserSubscriptionListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ELEMENT_DATA: usersubscriptiondisplay[] = [];
  oCurrentUserActiveUsersubscription: usersubscriptiondisplay;

  @Input() user: User;
  @Input() updateFromUserList: boolean;
  isFreeSubscription: boolean= false;
  loadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription[]>;
  selectSubscriptionById$: Observable<ServiceSubscription>;
  selectActiveSubscription$: Observable<ServiceSubscription>;

  selectCurrentUser$: Observable<User>;
  isListUserLoaded$: Observable<boolean>;

  displayedColumns = ['description', 'price', 'isActive', 'transactionDate', 'renewalDate'];
  dataSource: MatTableDataSource<usersubscriptiondisplay>;

  constructor(
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {

    //Load Subscriptions
    this.loadingIndicator$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);
    this.selectSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptions);
    this.selectActiveSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectActiveSubscription());
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  async loadData() {
    this.ELEMENT_DATA = [];
    //Load subscriptions if not avaliable
    await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());
      }
    });

    if (this.user && this.user.hasOwnProperty('usersubscription')) {
      for (var i = 0; i < this.user["usersubscription"]["subscriptions"].length; i++) {
        let description: string = '';
        let subscription: subscriptions = this.user["usersubscription"]["subscriptions"][i];
        await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
          if (result) {
            this.selectSubscriptionById$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionById(subscription["subscriptionId"].toString()));
            this.selectSubscriptionById$.subscribe((data: ServiceSubscription) => {
              if (data) {
                description = data.Name;
                let subscriptionInfo: usersubscriptiondisplay = new usersubscriptiondisplay();
                subscriptionInfo.id = data.id;
                subscriptionInfo.description = description;
                subscriptionInfo.price = data.Price;
                subscriptionInfo.isActive = subscription["isActive"];
                subscriptionInfo.transactionDate = subscription["createdOn"];
                subscriptionInfo.renewalDate = subscription["renewalOn"];
                this.ELEMENT_DATA.push(subscriptionInfo)
              }
            });
            //let oUsersubscriptiondisplay: usersubscriptiondisplay;
            this.oCurrentUserActiveUsersubscription = this.ELEMENT_DATA.filter(a => a.isActive == true)[0];
            this.isFreeSubscription = false;
            if (this.oCurrentUserActiveUsersubscription && this.oCurrentUserActiveUsersubscription.id == "WNiJ2h1kpYD83EzTpdaM") {
              this.isFreeSubscription = true;
            }
          }
        });
      }
    }
    this.dataSource.data =this.ELEMENT_DATA;
  }
  reload() {
    this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(UsersStoreSelectors.selectUserById(this.user.uid));
    this.selectCurrentUser$.subscribe(data => {
      this.user = data;
      this.loadData();
    })
  }
  dataRefreshEventHander($event: any) {
    console.log($event);
    this.loadData();
  }
  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }

  openChangeDialog() {
    const dialogRef = this.dialog.open(UserSubscriptionChangeComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: {
          currentSubscription: this.oCurrentUserActiveUsersubscription,
          updateFromUserList: this.updateFromUserList,
          user: this.user
        },

      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  openCancellationDialog() {
      const dialogRef = this.dialog.open(UserSubscriptionCancelComponent,
        {
          panelClass: 'mat-dialog-lg',
          disableClose: true,
          data: {
            currentSubscription: this.oCurrentUserActiveUsersubscription,
            updateFromUserList: this.updateFromUserList,
            user: this.user
          },

        });
      dialogRef.afterClosed().subscribe(u => {
        if (u) {
          console.log("After close" + u);
          //this.updateUsers(u);
        }
    }); 
  }
}

