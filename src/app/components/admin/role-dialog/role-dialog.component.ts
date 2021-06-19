// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Roles, Permission } from '@app/models';
import {  PermissionListComponent } from '@app/components';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions, PermissionsStoreSelectors, PermissionsStoreActions } from '@app/store';
import { Observable } from 'rxjs';
import { RoleEditorComponent } from '@app/components/admin/role-editor/role-editor.component';


@Component({
  selector: 'app-role-dialog',
  templateUrl: 'role-dialog.component.html',
  styleUrls: ['role-dialog.component.scss']
  
})
export class EditRoleDialogComponent implements AfterViewInit {
  @ViewChild(MatHorizontalStepper)
  stepper: MatHorizontalStepper;

  @ViewChild(RoleEditorComponent, { static: true })
  editRole: RoleEditorComponent;
  isLinear: boolean = true;
  isPermissionLoaded$: Observable<boolean>;

  get roleName(): any {
    return this.data.role ? { name: this.data.role.RoleName} : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Roles }, private store$: Store<RootStoreState.State>) {
    this.isPermissionLoaded$ = this.store$.pipe(select(PermissionsStoreSelectors.getPermissionLoaded));
  }
  @ViewChild(RoleEditorComponent, { static: true }) roleControl: RoleEditorComponent;
  @ViewChild(PermissionListComponent, { static: true }) permissionControl: PermissionListComponent;

  public onStepperNext() {
    switch (this.stepper.selectedIndex) {
      case 0:
        this.loadPermissionData();
        this.stepper.next();
        break;
      case 1:
        console.log(this.getPermissions().join());
        this.roleControl.selectedPermissions = this.getPermissions().join();
        this.roleControl.save();
        break;
    }
  }

 
  getPermissions(): string[] {
    let permissions: string[]=[];
    this.permissionControl.dataSource.data.forEach((permission: Permission) => {
      if (permission.Assigned === true) {
          permissions.push(permission.Value);
      }
    });
    return permissions;
  }

  async loadPermissionData() {
    await this.isPermissionLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new PermissionsStoreActions.PermissionsRequestAction());
      }
    });
  }
  ngAfterViewInit() {
    this.editRole.roleSaved$.subscribe(role=> this.dialogRef.close(role));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
