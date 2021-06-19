import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AngularFireMessaging } from '@angular/fire/messaging';

import {
  AuthService, AppTranslationService, AlertService,
  MessageSeverity, AppTitleService, ConfigurationService,
  LocalStoreManager,

  AccountService,
  Utilities
} from '@app/services';
import { Permission, usermessaging, notificationdisplay } from '../../../models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '../../../store';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../../models/user';
import { mergeMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisclaimerDialogComponent } from '../../disclaimer-dialog/disclaimer-dialog.component';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit, OnDestroy {

  @ViewChild('admin') adminExpander: MatExpansionPanel;

  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;
  selectedUser: User = new User();
  notificationdisplay: notificationdisplay;
  private _mobileQueryListener: () => void;
  currentMessage = new BehaviorSubject(null);
  mobileQuery: MediaQueryList;
  isUserLoggedIn: boolean;
  showCustom: boolean;
  appTitle = 'Urbanhood';
  message;
  isAdminExpanded = false;
  newNotificationCount = 0;
  gT = (key: string | Array<string>, interpolateParams?: object) => this.translationService.getTranslation(key, interpolateParams);

  get notificationsTitle() {
    if (this.newNotificationCount) {
      return `${this.gT('app.Notifications')} (${this.newNotificationCount} ${this.gT('app.New')})`;
    } else {
      return this.gT('app.Notifications');
    }
  }


  constructor(
    storageManager: LocalStoreManager,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private appTitleService: AppTitleService,
    private accountService: AccountService,
    private authService: AuthService,
    private translationService: AppTranslationService,
    public configurations: ConfigurationService,
    //private messagingService: MessagingService,
    public router: Router,
    public dialog: MatDialog,
    private angularFireMessaging: AngularFireMessaging,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private store$: Store<RootStoreState.State>
  ) {

    this.showCustom = false;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    storageManager.initialiseStorageSyncListener();

    //this.toastaConfig.theme = 'material';
    //this.toastaConfig.position = 'top-right';
    //this.toastaConfig.limit = 100;
    //this.toastaConfig.showClose = true;
    //this.toastaConfig.showDuration = false;

    this.appTitleService.appName = this.appTitle;

    this.angularFireMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  ngOnInit() {

    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));
    this.isCurrentUserLoaded$.subscribe((result: boolean) => {

      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
      else {
        this.selectCurrentUser$.subscribe(doc => {
          if (doc) {
            this.selectedUser = doc;
            if (!doc.hasOwnProperty('usersubscription') || doc.usersubscription.subscriptions.length < 0) {
              this.router.navigate(['/setprofile']);
            }
            else {

              if (doc.hasOwnProperty('usermessaging')) {
                if (!doc.usermessaging.messagetoken && !doc.usermessaging.remindlater) {
                  this.showCustom = true;
                }
                else {
                  this.receiveMessage();
                }
              }
              else {
                this.showCustom = true;
              }

              if ((!doc.hasOwnProperty('userdisclaimer') || !doc.hasOwnProperty('userquestions'))) {
                this.newDisclaimer();
              }
            }
          }
          else {
            this.router.navigate(['/setprofile']);
          }
        });
      }
    });


    //this.messagingService.requestPermission()
    //this.messagingService.receiveMessage()
    //this.message = this.messagingService.currentMessage

    this.isUserLoggedIn = this.authService.isLoggedIn;

    //setTimeout(() => {
    //  if (this.isUserLoggedIn) {
    //    this.alertService.resetStickyMessage();
    //    this.alertService.showMessage('Login', `Welcome back ${this.userName}!`, MessageSeverity.default);
    //  }
    //}, 2000);
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.email : '';
  }

  newDisclaimer() {
    //this.ngZone.run(() => {
    const dialogRef = this.dialog.open(DisclaimerDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { forcedisclaimer: true }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
    //});
  }


  logout() {
    this.authService.SignOut();
    this.authService.redirectLogoutUser();
  }

  //callMessage() {
  //  setTimeout(() => {
  //    if (this.message) {
  //      this.alertService.resetStickyMessage();
  //      this.message.subscribe((message: { notification }) => {
  //        this.alertService.showMessage(message.notification.title, message.notification.body, MessageSeverity.info);
  //        //console.log(message.notification.title);
  //        //console.log(message.notification.body);
  //      });
  //    }
  //  }, 10000);
  //}
  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  deleteToken() {
    this.angularFireMessaging.getToken
      .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
      .subscribe(
        (token) => {
          this.getUpdatedUser(true, '');
          console.log('Token deleted!');
        },
      );
  }

  requestPermission() {
    this.angularFireMessaging.requestToken
      .subscribe(
        (token) => {
          this.getUpdatedUser(false, token);
        },
        (error) => { console.error(error); },
      );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        this.notificationdisplay = payload["notification"];
        // console.log(payload["notification"]);
        // console.log(this.notificationdisplay);
        //this.showMessage();
        this.openSnackBar();
        //console.log("new message received. ", payload);

        //}, 10000);
        //this.currentMessage.next(payload);
      })
  }
  showMessage() {
    //this.alertService.resetStickyMessage();
    this.alertService.showMessage(this.notificationdisplay.title, this.notificationdisplay.body, MessageSeverity.info);
  }

  openSnackBar() {

    this.snackBar.open(this.notificationdisplay.title + "\n" + this.notificationdisplay.body, "VIEW", {
      duration: 6000,
      verticalPosition: 'top'
    });
  }

  getUpdatedUser(remindMeLater: boolean, token: string) {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    let nusertoken: usermessaging = new usermessaging(remindMeLater, token, new Date(now_utc), this.authService.currentUser.uid);
    let nUser: User = new User(this.selectedUser.uid, this.selectedUser.email, this.selectedUser.photoURL,
      this.selectedUser.emailVerified, this.selectedUser.isNewUser);

    if (this.selectedUser.userdisclaimer) {
      nUser.userdisclaimer = this.selectedUser.userdisclaimer;
    }
    if (this.selectedUser.userprofile) {
      nUser.userprofile = this.selectedUser.userprofile;
    }
    if (this.selectedUser.userroles) {
      nUser.userroles = this.selectedUser.userroles;
    }
    if (this.selectedUser.userothervalues) {
      nUser.userothervalues = this.selectedUser.userothervalues;
    }
    if (this.selectedUser.userdisclaimer) {
      nUser.userdisclaimer = this.selectedUser.userdisclaimer;
    }
    nUser.userpayment = [];
    for (var i = 0; i < this.selectedUser.userpayment.length; i++) {
      nUser.userpayment.push(this.selectedUser.userpayment[i]);
    }
    if (this.selectedUser.usersubscription) {
      nUser.usersubscription = this.selectedUser.usersubscription;
    }
    nUser.usermessaging = nusertoken;
    this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersNotificationRequestAction(nUser));
    this.selectCurrentUser$.subscribe(doc => {
      if (doc) {
        this.selectedUser = doc[0];
        this.showCustom = false;
        if (this.selectedUser.usermessaging) {
          if (!this.selectedUser.usermessaging.messagetoken && !this.selectedUser.usermessaging.remindlater) {
            this.showCustom = true;
          }
        }
      }
    });
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

  ngAfterViewInit() {
  }
}
