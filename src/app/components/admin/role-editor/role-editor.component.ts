// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import {
  AlertService, MessageSeverity,
  AppTranslationService, AuthService, AppService
} from '@app/services';

import { Roles, Permission } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions } from '@app/store';
import { PermissionListComponent } from '@app/components';

@Component({
  selector: 'app-role-editor',
  templateUrl: './role-editor.component.html',
  styleUrls: ['./role-editor.component.scss']
})
export class RoleEditorComponent implements OnChanges, OnDestroy {
  @ViewChild(PermissionListComponent, { static: true }) permissionControl: PermissionListComponent;
 @ViewChild('form', { static: true })
  private form: NgForm;

  isNewRole = false;
  public isSaving = false;
  private onRoleSaved = new Subject<Roles>();
  formattedAmount;
  @Input() role: Roles = new Roles();
  @Input() isEditMode = false;
  selectedPermissions: string='';
  roleForm: FormGroup;
  roleSaved$ = this.onRoleSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  get RoleName() {
    return this.roleForm.get('RoleName');
  }

  get RoleDescription() {
    return this.roleForm.get('RoleDescription');
  }

  get IsActive() {
    return this.roleForm.get('IsActive');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
  }

  ngOnChanges() {
    if (this.role) {
      this.isNewRole = false;
    } else {
      this.isNewRole = true;
      this.role = new Roles();
    }

    this.resetForm();
  }

  ngOnDestroy() {
  }

  public setRole(role?: Roles) {
    this.role = role;
    this.ngOnChanges();
  }

  private buildForm() {
    this.roleForm = this.formBuilder.group({
      RoleName: ['', Validators.required],
      RoleDescription: '',
      IsActive: [true, [Validators.required]]
    });
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.role) {
      this.isNewRole = true;
      this.role = new Roles();
    }

    this.roleForm.reset({
      RoleName: this.role.RoleName || '',
      RoleDescription: this.role.RoleDescription || '',
      IsActive: this.role.IsActive || ''
    });
  }

  public beginEdit() {
    this.isEditMode = true;
  }

  public save() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.roleForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    const editedRole = this.getEditedRole();
    console.log(editedRole);
    if (this.isNewRole) {
      this.store$.dispatch(new RolesStoreActions.AddRoleRequestAction(editedRole))
    } else {
      this.store$.dispatch(new RolesStoreActions.UpdateRoleRequestAction(editedRole))
    }
    this.onRoleSaved.next(this.role);
  }

  private getEditedRole(): Roles {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      const formModel = this.roleForm.value;
      let roleedit: Roles = new Roles();
      roleedit.id = this.isNewRole ? this.appService.getNewDocId() : this.role.id,
        roleedit.RoleName = formModel.RoleName,
        roleedit.Permission=this.selectedPermissions,
        roleedit.RoleDescription = formModel.RoleDescription,
      roleedit.IsActive = formModel.IsActive,
      roleedit.CreatedOn = this.isNewRole ? new Date(now_utc) : this.role.CreatedOn,
      roleedit.CreatedBy = this.isNewRole ? this.authService.currentUser.uid : this.role.CreatedBy
    return roleedit;
  }

  public cancel() {
    this.resetForm();
    this.isEditMode = false;

    this.alertService.resetStickyMessage();
  }

  getPermissions():string {
    let permissions: string;
    this.permissionControl.dataSource.data.forEach((permission: Permission) => {
      if (permission.Assigned) {
        permissions = permissions + "," + permission.Value;
      }
    });
    return permissions;
  }

  private saveCompleted(role?: Roles) {
    if (role) {
      //this.raiseEventIfRolesModified(this.subscription, subscription);
      this.role = role;
    }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    this.resetForm(true);

    //this.onUserSaved.next(this.user);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'One or more errors occured whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }
  }
