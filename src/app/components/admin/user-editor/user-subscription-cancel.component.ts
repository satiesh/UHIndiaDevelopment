import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { usersubscriptiondisplay, subscriptions } from '@app/models';
import { Store, select } from '@ngrx/store';
import {
  RootStoreState, CurrentUsersStoreActions,
  CurrentUsersStoreSelectors, UsersStoreSelectors, UsersStoreActions
} from '@app/store';
import { User } from '@app/models/user';
import { Utilities, AuthService } from '@app/services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-subscription-cancel',
  templateUrl: './user-subscription-cancel.component.html',
  styleUrls: ['./user-subscription-cancel.component.scss']
})
export class UserSubscriptionCancelComponent {

  @Output() dataRefreshEventHander = new EventEmitter<string>();

  isFreeSubscription: boolean = false;
  isCurrentUserLoading$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;
  isSubscriptionUpdated: boolean = false;
  updateFromUserList: boolean;
    get subscriptionName(): any {
    return this.data.currentSubscription ? { name: this.data.currentSubscription.description } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<UserSubscriptionCancelComponent>,
    private authService: AuthService,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { currentSubscription: usersubscriptiondisplay, updateFromUserList: boolean,  user: User },
    private store$: Store<RootStoreState.State>
  ) {
    if (this.data.currentSubscription.id == "WNiJ2h1kpYD83EzTpdaM") {
      this.isFreeSubscription = true;
    }
    this.updateFromUserList = this.data.updateFromUserList;
 }
  ngOnInit() {
    if (!this.updateFromUserList) {
    this.isCurrentUserLoading$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
      this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));
    }
    else {
      this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
      this.selectCurrentUser$ = this.store$.select(UsersStoreSelectors.selectUserById(this.data.user.uid));
    }
  }

  cancelSubscription(): void {

    let nUser: User = Utilities.userDTO(this.data.user, this.authService.currentUser.uid);
    let asubscription: subscriptions = nUser.usersubscription.subscriptions.filter(a => a.isActive == true)[0];
    asubscription.isActive = false;
    let nsubsctiption: subscriptions = new subscriptions("WNiJ2h1kpYD83EzTpdaM", true, Utilities.getRenewalDate("free"),
      new Date(Utilities.getCurrentDateUTC()), this.authService.currentUser.uid)
    nUser.usersubscription.subscriptions.push(nsubsctiption);
    //console.log(nUser);

    if (!this.updateFromUserList) {
      this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersSubscriptionRequestAction(nUser));
    }
    else {
      this.store$.dispatch(new UsersStoreActions.UpdateUsersSubscriptionRequestAction(nUser));
    }

    this.selectCurrentUser$.subscribe(result => {
      if (result) {
        let asubscription: subscriptions = result.usersubscription.subscriptions.filter(a => a.isActive == true)[0];
        if (asubscription.subscriptionId == "WNiJ2h1kpYD83EzTpdaM") {
          this.isSubscriptionUpdated = true;
          //this.dialogRef.close(null);
          //this.authService.SignOut();
          //this.authService.redirectLogoutUser();
        }
      }
    });
  }

  logout(): void {
    this.dialogRef.close(null);
    this.authService.SignOut();
    this.authService.redirectLogoutUser();
  }
  cancel(): void {
    if (this.isSubscriptionUpdated && !this.updateFromUserList) {
      this.dialogRef.close(null);
      this.logout();
    }
    else {
      this.dialogRef.close(null);
      //if (this.updateFromUserList) {
      //  console.log("here")
      //  this.dataRefreshEventHander.emit('true');
      //}
    }
  }
}
