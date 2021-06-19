import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions, OptionsTradeStoreSelectors, OptionsTradeStoreActions } from '../../store';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { AuthService, AccountService } from '@app/services';
import { MatDialog } from '@angular/material/dialog';
import { Permission, optionstrade } from '@app/models';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TradeComponent implements OnInit {

  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;

  optionLoadingIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade[]>;
  selectDailyOptionsTrade$: Observable<optionstrade[]>;
  recordFound: boolean = false;
  dailyOptionTrade: optionstrade[];
  allTradeData: optionstrade[];

  constructor(private _formBuilder: FormBuilder,
    private authService: AuthService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {

  }

  ngOnInit(): void {
    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));

    this.optionLoadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.selectDailyOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradeByTodaysDate(this.authService.groupInfo));
    this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTrades);


    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    });

    this.isOptionsTradeLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction())
      }
    })

    this.loadData();
  }

  loadData() {
    //this.selectOptionsTrade$.subscribe((data: optionstrade[]) => {
    //  if (data) {
    //    this.allTradeData = data;
    //  }
    //});

    //this.selectDailyOptionsTrade$.subscribe((data: optionstrade[]) => {
    //  if (data) {
    //    this.dailyOptionTrade = data;
    //  }
    //});
  }
  get canViewCourses() {
    return this.accountService.userHasPermission(Permission.viewCoursesPermission);
  }

  get canManageCourses() {
    return this.accountService.userHasPermission(Permission.manageCoursesPermission);
  }

  get canViewUsers() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }
  get canManageUsers() {
    return this.accountService.userHasPermission(Permission.manageUsersPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

  get canViewSubscriptions() {
    return this.accountService.userHasPermission(Permission.viewSubscriptions);
  }

  get canManageSubscriptions() {
    return this.accountService.userHasPermission(Permission.manageSubscriptions);
  }

  get canViewStockOftheDay() {
    return this.accountService.userHasPermission(Permission.viewStockoftheday);
  }

  get canManageStockOftheDay() {
    return this.accountService.userHasPermission(Permission.manageStockoftheday);
  }
  get canViewOptionTrade() {
    return this.accountService.userHasPermission(Permission.viewOptionTrade);
  }

  get canManageOptionTrade() {
    return this.accountService.userHasPermission(Permission.manageOptionTrade);
  }

  get canViewCoupons() {
    return this.accountService.userHasPermission(Permission.viewCoupons);

  }
  get canManageCoupons() {
    return this.accountService.userHasPermission(Permission.manageCoupons);
  }
}
