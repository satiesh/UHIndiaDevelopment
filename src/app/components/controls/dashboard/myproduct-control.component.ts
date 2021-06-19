// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService, AppTranslationService, AccountService, fadeInOut, MessageSeverity, Utilities, AppService, AuthService } from '@app/services';
import { Permission, subscriptions, ServiceSubscription } from '@app/models/';
import { Observable, interval } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreSelectors, OptionsTradeStoreActions, UsersStoreSelectors, UserOptionTradeStoreSelectors, UserOptionTradeStoreActions, CurrentUsersStoreSelectors, CurrentUsersStoreActions, SubscriptionStoreSelectors, SubscriptionStoreActions } from '@app/store';
import { EditOptionsTradeDialogComponent, OptionsTradeCommentComponent, OptionsTradeViewComponent } from '@app/components/';
import { useroptiontrades } from '../../../models/useroptiontrade';
import { startWith, flatMap } from 'rxjs/operators';
import { User } from '../../../models/user';

@Component({
  selector: 'myproduct-control',
  templateUrl: './myproduct-control.component.html',
  styleUrls: ['./myproduct-control.component.scss'],
  animations: [fadeInOut]
})

export class MyProductComponent implements OnInit, AfterViewInit {

  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;

  subscriptionLoadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription[]>;

  subscriptioName: string;
  currentSubscriptions: subscriptions;

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private authService: AuthService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {
    // Assign the data to the data source for the table to render
    if (this.canViewOptionTrade) {
    }
  }

  ngAfterViewInit(): void {
    // throw new Error("Method not implemented.");
  }
  ngOnInit(): void {

    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));

    this.subscriptionLoadingIndicator$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);
    this.selectSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptions);

    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    });
    this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) { this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction()); }
    });
    this.getCurrentSubscription();
  }

  getCurrentSubscription() {
    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectCurrentUser$.subscribe(data => {
          this.currentSubscriptions = data.usersubscription.subscriptions.filter(a => a.isActive === true)[0];
          this.isSubscriptionLoaded$.subscribe((result: boolean) => {
            if (result) {
              this.selectSubscription$.subscribe(data => {
              //  console.log(JSON.stringify(data));
                let sb = data.filter(a => a.id === this.currentSubscriptions.subscriptionId)[0];
              //  console.log(sb);
                this.subscriptioName = data.filter(a => a.id === this.currentSubscriptions.subscriptionId)[0].Name;
              })
            }
          });
        });
      
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

}
