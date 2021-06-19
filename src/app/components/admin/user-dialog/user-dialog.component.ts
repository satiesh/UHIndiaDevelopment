// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions, PermissionsStoreSelectors, PermissionsStoreActions, UsersStoreActions, UsersStoreSelectors } from '@app/store';
import { Observable } from 'rxjs';
//import { User } from 'firebase';
import { AccountService, MessageSeverity, AlertService, DialogType, Utilities } from '@app/services';
import { User } from '@app/models/user';
import { Permission } from '../../../models';
import { UserOtherValuesComponent } from '../user-editor/user-other-values.component';
import { UserProfileEditorComponent } from '../user-editor/user-profile.component';
import { UserInvestmentTypeComponent } from '../user-editor/user-investmenttype.component';
import { UserInvestorLevelComponent } from '../user-editor/user-investorlevel.component';
import { UserTradingToolsComponent } from '../user-editor/user-tradingtools.component';
import { UserRolesComponent } from '../user-editor/user-roles.component';


@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog.component.html',
  styleUrls: ['user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditUserDialogComponent implements AfterViewInit {
  //updateFromUserList: boolean;
  isEditMode: boolean;
  collect$: Observable<any>;
  isListUserLoaded$: Observable<boolean>;
  saveRecord: boolean = false;
  @ViewChild(UserOtherValuesComponent, { static: true }) userOtherValuesControl: UserOtherValuesComponent;
  @ViewChild(UserProfileEditorComponent, { static: true }) userProfileControl: UserProfileEditorComponent;
  @ViewChild(UserInvestmentTypeComponent, { static: true }) userInvestmentType: UserInvestmentTypeComponent;
  @ViewChild(UserInvestorLevelComponent, { static: true }) userInvestorLevel: UserInvestorLevelComponent;
  @ViewChild(UserTradingToolsComponent, { static: true }) userTrandingTools: UserTradingToolsComponent;
  @ViewChild(UserRolesComponent, { static: true }) UserRoles: UserRolesComponent;



  get userName(): any {
    return this.data.user ? { name: this.data.user.displayName } : null;
  }

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, updateFromUserList: boolean }, private store$: Store<RootStoreState.State>) {
    this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
  }


  ngAfterViewInit() {
    //this.editRole.roleSaved$.subscribe(role => this.dialogRef.close(role));
  }
  configure(response: boolean, value?: string) {
    if (response) {
      this.dialogRef.close(null);
    } else {
    }
  }


  save() {
    this.saveRecord = false;
    var nuser: User = Utilities.userDTO(this.data.user);

    if (this.userProfileControl.userForm.dirty) {
      nuser.userprofile = this.userProfileControl.getuserProfileData();
      nuser.displayName = this.userProfileControl.getuserProfileData().firstName + " " + this.userProfileControl.getuserProfileData().lastName;
      this.saveRecord = true;
    }

    if (this.userOtherValuesControl.userOtherValues.dirty) {
      nuser.userothervalues = this.userOtherValuesControl.getuserOtherValues();
      this.saveRecord = true;
    }
    if (this.userInvestmentType.updateMade) {
      var investementypye: string[] = this.userInvestmentType.getSelectedvalues();
      nuser.userothervalues.investmentType = investementypye.join(',');
      this.saveRecord = true;
    }
    if (this.userInvestorLevel.updateMade) {
      var selectedLevelId: string = this.userInvestorLevel.getSelectedvalues();
      nuser.userothervalues.investorLevel = selectedLevelId;
      this.saveRecord = true;
    }
    if (this.userTrandingTools.updateMade) {
      var selectedtrandingTools: string[] = this.userTrandingTools.getSelectedvalues();
      nuser.userothervalues.tradingTools = selectedtrandingTools.join(',');
      this.saveRecord = true;
    }
    if (this.UserRoles.updateMade) {
      var selectedRoles: string[] = this.UserRoles.getSelectedvalues();
      nuser.userroles.roleName = selectedRoles.join(',');
      this.saveRecord = true;
    }
    if (this.saveRecord) {
      this.store$.dispatch(new UsersStoreActions.UpdateUserRequestAction(nuser));
      this.isListUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "User data saved successfully!", MessageSeverity.success);
        }
      });
    }

  }

  cancel(): void {
    if (((this.userProfileControl && !this.userProfileControl.userForm.dirty) && (this.userOtherValuesControl && !this.userOtherValuesControl.userOtherValues.dirty)  &&
      (this.userInvestmentType && !this.userInvestmentType.updateMade) && 
      (this.userInvestorLevel && !this.userInvestorLevel.updateMade) &&
      (this.userTrandingTools &&!this.userTrandingTools.updateMade) &&
        (this.UserRoles && !this.UserRoles.updateMade)) || this.saveRecord) {
      this.dialogRef.close(null);
    }
    else {
      this.alertService.showDialog('Message', "You have made some changes to the profile. Do you want to close the window without saving the record?", DialogType.confirm, (val) => this.configure(true, val), () => this.configure(false), 'Yes', 'No', 'Default');

    }
  }

  get canViewUserPersonnel() {
    return this.accountService.userHasPermission(Permission.viewUsersPersonnelPermission);
  }
  get canManageUserPersonnel() {
    return this.accountService.userHasPermission(Permission.manageUsersPersonnelPermission);
  }

  get canViewUserRole() {
    return this.accountService.userHasPermission(Permission.viewUsersRolePermission);
  }
  get canManageUserRole() {
    return this.accountService.userHasPermission(Permission.manageUsersRolePermission);
  }

  get canViewUserSubscription() {
    return this.accountService.userHasPermission(Permission.viewUsersSubscriptionPermission);
  }
  get canManageUserSubscription() {
    return this.accountService.userHasPermission(Permission.manageUsersSubscriptionPermission);
  }
  get canViewUserPayment() {
    return this.accountService.userHasPermission(Permission.viewUsersPaymentPermission);
  }
  get canManageUserPayment() {
    return this.accountService.userHasPermission(Permission.manageUsersPaymentPermission);
  }
  get canViewUserTradingTools() {
    return this.accountService.userHasPermission(Permission.viewUsersTradingToolsPermission);
  }
  get canManageUserTradingTools() {
    return this.accountService.userHasPermission(Permission.manageUsersTradingToolsPermission);
  }
  get canViewUserInvestmentType() {
    return this.accountService.userHasPermission(Permission.viewUsersInvestmentTypePermission);
  }
  get canManageUserInvestmentType() {
    return this.accountService.userHasPermission(Permission.manageUsersInvestmentTypePermission);
  }
  get canViewUserInvesterLevel() {
    return this.accountService.userHasPermission(Permission.viewUsersInvesterLevelPermission);
  }
  get canManageUserInvesterLevel() {
    return this.accountService.userHasPermission(Permission.manageUsersInvesterLevelPermission);
  }
  get canViewUserOthers() {
    return this.accountService.userHasPermission(Permission.viewUsersOthersPermission);
  }
  get canManageUserOthers() {
    return this.accountService.userHasPermission(Permission.manageUsersOthersPermission);
  }
  get canViewUserDisclaimer() {
    return this.accountService.userHasPermission(Permission.viewUsersDisclaimerPermission);
  }
  get canManageUserDisclaimer() {
    return this.accountService.userHasPermission(Permission.manageUsersDisclaimerPermission);
  }
}
