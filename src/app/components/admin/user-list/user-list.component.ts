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
import { Permission } from '@app/models/';
import { Observable } from 'rxjs';
//import { User } from 'firebase';
import { Store, select } from '@ngrx/store';
import { RootStoreState, UsersStoreSelectors, UsersStoreActions } from '@app/store';
import { EditUserDialogComponent } from '@app/components/admin/user-dialog/user-dialog.component';
import { User } from '@app/models/user';
import { NewUserDialogComponent } from '../user-new-dialog/user-new-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [fadeInOut]
})

export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['displayName', 'email', 'memberId', 'mobileNumber', 'emailVerified'];
  dataSource: MatTableDataSource<User>;
  sourceUser: User;

  loadingIndicator$: Observable<boolean>;
  isUsersLoaded$: Observable<boolean>;
  selectUsers$: Observable<User[]>;


  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {


    if (this.canManageUsers) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {

    this.loadingIndicator$ = this.store$.select(UsersStoreSelectors.selectUsersLoading);
    this.isUsersLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    this.selectUsers$ = this.store$.select(UsersStoreSelectors.selectUsers);
    this.loadData();
  }

  async loadData() {

    await this.isUsersLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new UsersStoreActions.UsersRequestAction());
      }
      else {
        this.selectUsers$.subscribe(
          courses => this.onDataLoadSuccessful(courses),
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


  private onDataLoadSuccessful(users: User[]) {
    this.alertService.stopLoadingMessage();
    this.dataSource.data = users;
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

  editUser(user?: User) {
    this.sourceUser = user;
    const dialogRef = this.dialog.open(EditUserDialogComponent,
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
  reloadUsers() {
    this.store$.dispatch(new UsersStoreActions.UsersRequestAction());
    this.selectUsers$.subscribe(
      users => this.onDataLoadSuccessful(users),
      error => this.onDataLoadFailed(error)
    );
  }


  confirmDisable(user: User) {
    let message: string = !user.disabled ? 'Disable ' + user.displayName + '?' : 'Enable ' + user.displayName + '?';
    let title: string = !user.disabled ? 'DISABLE' : 'ENABLE';
    //user.disabled = !user.disabled ? true : false;
    //console.log(user);
    //user.disabled
    let nUser: User = Utilities.userDTO(user);
    nUser.disabled = !user.disabled ? true : false;
    //console.log(nUser);

    this.snackBar.open(message, title, { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Processing...');
        this.store$.dispatch(new UsersStoreActions.DisableUsersRequestAction(nUser))
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            if (!loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  confirmDelete(user: User) {

    this.snackBar.open(`Delete ${user.email}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.store$.dispatch(new UsersStoreActions.DeleteUsersRequestAction(user))
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            if (!loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  get canManageUsers() {
    return this.accountService.userHasPermission(Permission.manageUsersPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

}
