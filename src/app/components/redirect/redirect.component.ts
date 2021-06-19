import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService, AlertService, MessageSeverity, AccountService } from '@app/services';
import { userprofile } from '@app/models';
import { Router } from '@angular/router';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '@app/store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '@app/models/user';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  isUserLoggedIn: boolean;
  userProfile: userprofile;
  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;

  constructor(
    public router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private accountService: AccountService,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private store$: Store<RootStoreState.State>
  ) { }


  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn;
    this.alertService.showStickyMessage('Verifying', `Please wait redirecting...`, MessageSeverity.default);

    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));

    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    });
    this.decideLandingPage();
  }
  decideLandingPage() {
    this.selectCurrentUser$.subscribe(doc => {
      if (doc && !doc.hasOwnProperty('usersubscription') && doc.usersubscription.subscriptions.length <= 0) {
        this.router.navigate(['/setprofile']);
      }
      else {
        this.router.navigate(['/auth/dashboard']);
      }
      //if (doc) {
      //  if (doc["usersubscription"]) {
      //    if (doc[0]["usersubscription"].subscriptions && doc[0]["usersubscription"].subscriptions.length > 0) {
      //      this.router.navigate(['/auth/dashboard']);
      //    }
      //    else {
      //      this.router.navigate(['/setprofile']);
      //    }
      //  }
      //  else {
      //    this.router.navigate(['/setprofile']);
      //  }
      //}
      //else {
      //  this.router.navigate(['/setprofile']);
      //}
    })
  }
}
