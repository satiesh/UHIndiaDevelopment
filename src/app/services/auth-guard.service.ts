// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '../store';
import { Observable } from 'rxjs';
import { User } from '@app/models/user';
import { LocalStoreManager } from './local-store-manager.service';
import { DBkeys } from './db-keys';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User[]>;
  getLocalStorageValues: any = [];
 
  constructor(private authService: AuthService,
    private router: Router, private localStorageValues: LocalStoreManager,
    private store$: Store<RootStoreState.State>) { 
      this.getLocalStorageValues = this.localStorageValues;
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const url: string = state.url;
    if (this.checkLogin(url)) {
      return true;
        //return this.subscriptionCheck();
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {

    const url = `/${route.path}`;
    return this.checkLogin(url);
  }
  subscriptionCheck(): boolean {
    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);

    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
      else {
        this.selectCurrentUser$.subscribe(doc => {
          if (doc) {
            console.log(doc);
            if (doc[0]["usersubscription"]) {
              if (doc[0]["usersubscription"].subscriptions && doc[0]["usersubscription"].subscriptions.length > 0) {
                return true;
              }
              else {
                this.router.navigate(['/setprofile']);
                return false;
              }
            }
            else {
              this.router.navigate(['/setprofile']);
              return false;
            }
          }
          else {
            this.router.navigate(['/setprofile']);
            return false;
          }
        })
      }
    });
    return true;
  }
 
  checkLogin(url: string): boolean {

    if (this.authService.isLoggedIn) {
      // this.getLocalValue = localStorage.getItem('sync_keys');
      // console.log('Sync Value' , this.getLocalValue.length);
      // if(this.getLocalStorageValues.sync_keys.length > 0 ) {
      //   console.log('Sync Value' , this.getLocalStorageValues)
      //   return true;
      // }
      return true;
    }

    this.authService.loginRedirectUrl = url;
    this.router.navigate(['/login']);
    return false;
      }

  get checksubscription(): boolean {
    let isSubscriptionGood: boolean = false;
    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectCurrentUser$.subscribe(doc => {
          if (doc) {
            if (doc[0]["usersubscription"]) {
              if (doc[0]["usersubscription"].subscriptions && doc[0]["usersubscription"].subscriptions.length > 0) {
                isSubscriptionGood = true;
                return isSubscriptionGood;
              }
              else {
                isSubscriptionGood = false;
                return isSubscriptionGood;
              }
            }
            else {
              isSubscriptionGood = false;
              return isSubscriptionGood;
            }
          }
        });
      }
    })
    return isSubscriptionGood;
  }
}
