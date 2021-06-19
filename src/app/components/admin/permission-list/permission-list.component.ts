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
import { AlertService, AppTranslationService, AccountService, fadeInOut, MessageSeverity, Utilities } from '@app/services';
import { Permission, Roles } from '@app/models/';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootStoreState, PermissionsStoreSelectors, PermissionsStoreActions } from '@app/store';


@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  animations: [fadeInOut]
})

export class PermissionListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['Name', 'Assigned'];
  dataSource: MatTableDataSource<Permission>;
  sourcePermission: Permission;
  loadingIndicator: boolean;
  @Input() role: Roles = new Roles();

  loadingIndicator$: Observable<boolean>;
  isPermissionLoaded$: Observable<boolean>;
  selectPermission$: Observable<Permission[]>;


  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.pipe(select(PermissionsStoreSelectors.getPermissionLoading));
    this.isPermissionLoaded$ = this.store$.pipe(select(PermissionsStoreSelectors.getPermissionLoaded));
    this.selectPermission$ = this.store$.pipe(select(PermissionsStoreSelectors.getPermission));
    this.loadData();
  }

  async loadData() {
    await this.isPermissionLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new PermissionsStoreActions.PermissionsRequestAction());
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            this.SetLoadingIndicator(loading)
          });
        this.selectPermission$.subscribe(
          permission => this.onDataLoadSuccessful(permission),
          error => this.onDataLoadFailed(error)
        );

      }
      else {
        this.selectPermission$.subscribe(
          permission => this.onDataLoadSuccessful(permission),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }


  private SetLoadingIndicator(loading: boolean) {
    if (loading) {
      this.loadingIndicator = loading;
    }
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(permissions: Permission[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    if (this.role.Permission) {
      let nPErmissions: Permission[] = [];
      let nPErmission: Permission = new Permission();
      for (var i = 0; i < permissions.length; i++) {
        let markTrue: boolean = this.checkIfPermissionExist(permissions[i].Value);
        if (markTrue) {
          nPErmission= new Permission();
          nPErmission.Assigned = true;
          nPErmission.Value = permissions[i]["Value"];
          nPErmission.Name = permissions[i]["Name"];
          nPErmission.Description = permissions[i]["Description"];
          nPErmission.CreatedBy = permissions[i]["CreatedBy"];
          nPErmission.CreatedOn = permissions[i]["CreatedOn"];
          nPErmission.IsActive = permissions[i]["IsActive"];
          nPErmissions.push(nPErmission);
        }
        else {
          nPErmission = new Permission();
          nPErmission.Assigned = false;
          nPErmission.Value = permissions[i]["Value"];
          nPErmission.Name = permissions[i]["Name"];
          nPErmission.Description = permissions[i]["Description"];
          nPErmission.CreatedBy = permissions[i]["CreatedBy"];
          nPErmission.CreatedOn = permissions[i]["CreatedOn"];
          nPErmission.IsActive = permissions[i]["IsActive"];
          nPErmissions.push(nPErmission);
        }
      }
      this.dataSource.data = nPErmissions;
     }
    else {
      let nPErmissions: Permission[] = [];
      let nPErmission: Permission = new Permission();
      for (var i = 0; i < permissions.length; i++) {
        nPErmission = new Permission();
        nPErmission.Assigned = false;
        nPErmission.Value = permissions[i]["Value"];
        nPErmission.Name = permissions[i]["Name"];
        nPErmission.Description = permissions[i]["Description"];
        nPErmission.CreatedBy = permissions[i]["CreatedBy"];
        nPErmission.CreatedOn = permissions[i]["CreatedOn"];
        nPErmission.IsActive = permissions[i]["IsActive"];
        nPErmissions.push(nPErmission);
        //this.dataSource.data = permissions;
      }
      this.dataSource.data = nPErmissions;
    }
  }

  checkIfPermissionExist(permission: string) {
    var strArr = this.role.Permission.split(',');
    if (strArr.indexOf(permission) > -1) {
      return true;
    }
  }




  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageUsersPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

}
