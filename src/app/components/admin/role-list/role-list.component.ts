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
import { Permission, Roles } from '@app/models/';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions } from '@app/store';
import { EditRoleDialogComponent } from '@app/components/admin/role-dialog/role-dialog.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  animations: [fadeInOut]
})

export class RoleListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['RoleName', 'RoleDescription', 'IsActive'];
  dataSource: MatTableDataSource<Roles>;
  sourceRoles: Roles;

  loadingIndicator$: Observable<boolean>;
  isRolesLoaded$: Observable<boolean>;
  selectRoles$: Observable<Roles[]>;


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {


    if (this.canManageRoles) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
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
      this.selectRoles$.subscribe(
        roles => this.onDataLoadSuccessful(roles),
        error => this.onDataLoadFailed(error)
      );
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(roles: Roles[]) {
    this.alertService.stopLoadingMessage();
    this.dataSource.data = roles;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }
  editRole(role?: Roles) {
    this.sourceRoles = role;
    const dialogRef = this.dialog.open(EditRoleDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { role }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  confirmDelete(role: Roles) {

    this.snackBar.open(`Delete ${role.RoleName}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
      });
  }

  reloadRoles() {
    this.store$.dispatch(new RolesStoreActions.RolesRequestAction());
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
