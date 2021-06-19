// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService, AppTranslationService, AccountService, fadeInOut, MessageSeverity, Utilities, AuthService } from '@app/services';
import { Permission, Roles } from '@app/models/';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions, CurrentUsersStoreSelectors, UsersStoreSelectors, CurrentUsersStoreActions, UsersStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-user-role-list',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
  animations: [fadeInOut]
})

export class UserRolesComponent implements OnInit{
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() user: User;
  @Input() updateFromUserList: boolean;

  displayedColumns = ['RoleName', 'Permission', 'IsActive'];
  dataSource: MatTableDataSource<Roles>;
  sourceRoles: Roles;

  isCurrentUserLoaded$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  loadingIndicator$: Observable<boolean>;
  isRolesLoaded$: Observable<boolean>;
  selectRoles$: Observable<Roles[]>;
  updateMade: boolean = false;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private store$: Store<RootStoreState.State>) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {

    if (!this.updateFromUserList) {
      this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    }
    else {
      this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    }

    this.loadingIndicator$ = this.store$.pipe(select(RolesStoreSelectors.getRoleLoading));
    this.isRolesLoaded$ = this.store$.pipe(select(RolesStoreSelectors.getRoleLoaded));
    this.selectRoles$ = this.store$.pipe(select(RolesStoreSelectors.getRole));

    this.loadData();
  }

  async loadData() {

    await this.isRolesLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new RolesStoreActions.RolesRequestAction());
      }
      else {
        this.selectRoles$.subscribe(
          roles => this.onDataLoadSuccessful(roles),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }


  madeChange() {
    this.updateMade = true;
  }

  public getSelectedvalues() {
    var selectedRoleName: string[] = [];
    this.dataSource.data.forEach(row => {
      if (row.IsActive) {
        selectedRoleName.push(row.RoleName);
      }
    }
    );
    return selectedRoleName;
  }

  private onDataLoadSuccessful(roles: Roles[]) {
    this.alertService.stopLoadingMessage();
    let nRples: Roles[] = [];
    let nRole: Roles = new Roles();

    if (this.user && this.user.userroles.roleName) {
      for (var i = 0; i < roles.length; i++) {
        let markTrue: boolean = this.checkIfRoleExist(roles[i].RoleName);
        if (markTrue) {
          nRole = new Roles();
          nRole.IsActive = true;
          nRole.RoleName = roles[i]["RoleName"];
          nRole.Permission = roles[i]["Permission"];
          nRole.RoleDescription = roles[i]["RoleDescription"];
          nRole.CreatedBy = roles[i]["CreatedBy"];
          nRole.CreatedOn = roles[i]["CreatedOn"];
          nRples.push(nRole);
        }
        else {
          nRole = new Roles();
          nRole.IsActive = false;
          nRole.RoleName = roles[i]["RoleName"];
          nRole.Permission = roles[i]["Permission"];
          nRole.RoleDescription = roles[i]["RoleDescription"];
          nRole.CreatedBy = roles[i]["CreatedBy"];
          nRole.CreatedOn = roles[i]["CreatedOn"];
          nRples.push(nRole);
        }
      }
      //this.dataSource.data = nRples;
    }
    else {
      for (var i = 0; i < roles.length; i++) {
        nRole = new Roles();
        nRole.IsActive = false;
        nRole.RoleName = roles[i]["RoleName"];
        nRole.Permission = roles[i]["Permission"];
        nRole.RoleDescription = roles[i]["RoleDescription"];
        nRole.CreatedBy = roles[i]["CreatedBy"];
        nRole.CreatedOn = roles[i]["CreatedOn"];
        nRples.push(nRole);
      }
    }
    this.dataSource.data = nRples;
   }

  checkIfRoleExist(roleName: string) {
    var strArr = this.user.userroles.roleName.split(',');
    if (strArr.indexOf(roleName) > -1) {
      return true;
    }
  }


  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  save() {
    var selectedRoleName: string[] = [];
    this.dataSource.data.forEach(row => {
      if (row.IsActive) {
        selectedRoleName.push(row.RoleName);
      }
    }
    );
    if (selectedRoleName.length <= 0) {
      this.alertService.showMessage('SAVE ERROR', `Atleast select one role to save the data`,MessageSeverity.error);
      return;
    }

    let nuser: User = Utilities.userDTO(this.user, this.authService.currentUser.uid);
    nuser.userroles.roleName = selectedRoleName.join();

    if (!this.updateFromUserList) {
      this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Saved successfully!", MessageSeverity.success);
        }
      });
    }
    else {
      this.store$.dispatch(new UsersStoreActions.UpdateUserRoleRequestAction(nuser));
      this.isListUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Role(s) saved successfully!", MessageSeverity.success);
        }
      });
    }
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

}
