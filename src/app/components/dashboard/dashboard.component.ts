import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { ConfigurationService, AuthService } from '@app/services';
import { fadeInOut } from '../../services/animations';
import { Store } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions, UsersStoreActions, SubscriptionStoreActions, OptionsTradeStoreActions, OptionsTradeStoreSelectors, UsersStoreSelectors } from '../../store';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServiceSubscription, optionstrade } from '../../models';

interface graphData {
  data: countData[];
}
interface countData {
  name?: string;
  postCount?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInOut]
})


export class DashboardComponent implements OnInit {
  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;

  loadingTradingFeederIndicator$: Observable<boolean>;
  tradingFeederLoaded$: Observable<boolean>;
  tradingFeeder$: Observable<User[]>;

  loadingOptionIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade[]>;


  //myData: graphData[] = [];
  myData;

  options = {
    pieHole: 0.4
    //is3D: true
  };


  constructor(public configurations: ConfigurationService,
    public router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    readonly ngZone: NgZone,
    private store$: Store<RootStoreState.State>
  ) {
  }

  async ngOnInit() {
    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));

    this.loadingTradingFeederIndicator$ = this.store$.select(UsersStoreSelectors.selectUsersLoading);
    this.tradingFeederLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    this.tradingFeeder$ = this.store$.select(UsersStoreSelectors.selectUserByRoleId("TradeFeeder"));

    this.loadingOptionIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesByGroup(this.authService.groupInfo));
    console.log(this.authService.groupInfo);
    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    });

    await this.tradingFeederLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new UsersStoreActions.UsersRequestAction());
      }
    })

    await this.isOptionsTradeLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
      }
    });
    this.loadData();

    //this.myData = [
    //  ['London', 8136000],
    //  ['New York', 8538000],
    //  ['Paris', 2244000],
    //  ['Berlin', 3470000],
    //  ['Kairo', 19500000],
    //];
  }

  loadData() {
    this.tradingFeeder$.subscribe((data => {
      if (data) {
        this.myData = [];
        this.pushData(data, '');
      }
    }))
  }

  pushData(myData: User[], displayName: string) {
    this.selectOptionsTrade$.subscribe((subData => {
      if (subData.length > 0) {
        for (var i = 0; i < myData.length; i++) {
          let displayName = myData[i].displayName;
          let databyuser = subData.filter(a => a.postedby == displayName);
          var arr = [displayName, databyuser.length];
          this.myData.push(arr);
        }
      }
    }));
  }
}
