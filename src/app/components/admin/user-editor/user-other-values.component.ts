// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, Observable } from 'rxjs';

import {
  AlertService, MessageSeverity,
  AppTranslationService, AuthService, AppService, ValidationService, AccountService, Utilities
} from '@app/services';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, UsersStoreSelectors, CurrentUsersStoreActions, UsersStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { MatSelectChange } from '@angular/material/select';
import { InvestorLevelStoreSelectors, InvestorLevelStoreActions } from '../../../store/investorlevel-data';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-other-values',
  templateUrl: './user-other-values.component.html',
  styleUrls: ['./user-other-values.component.scss']
})

export class UserOtherValuesComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('form', { static: true })

  private form: NgForm;
  @Input() user: User;
  @Input() isEditMode = false;
  @Input() updateFromUserList: boolean;
  userOtherValues: FormGroup;

  isCurrentUserLoaded$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  selectUser$: Observable<User>;

  get investingobjective() {
    return this.userOtherValues.get('investingobjective');
  }
  get bestCommunicationMethod() {
    return this.userOtherValues.get('bestCommunicationMethod');
  }
  get bestTimeToCall() {
    return this.userOtherValues.get('bestTimeToCall');
  }
  get professionalField() {
    return this.userOtherValues.get('professionalField');
  }
  get discordID() {
    return this.userOtherValues.get('discordID');
  }
  get currentPortfolioSize() {
    return this.userOtherValues.get('currentPortfolioSize');
  }
  get volunteer() {
    return this.userOtherValues.get('volunteer');
  }
  get ipaddress() {
    return this.userOtherValues.get('ipaddress');
  }
  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
  }

  ngOnInit() {
    if (!this.updateFromUserList) {
      this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
      this.selectUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));
    }
    else {
      if (this.user) {
        this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
        this.selectUser$ = this.store$.select(UsersStoreSelectors.selectUserById(this.user.uid));
      }
      else {
        this.user = Utilities.newUserDTO();
      }
    }

  }

  private buildForm() {
    this.userOtherValues = this.formBuilder.group({
      investingobjective: [''],
      bestCommunicationMethod: [''],
      bestTimeToCall: [''],
      professionalField: [''],
      discordID: [''],
      currentPortfolioSize: [''],
      volunteer: [''],
      ipaddress: ['']
    });
  }
  public resetForm(stopEditing = false) {
    if (stopEditing) {
      this.isEditMode = false;
    }

    this.userOtherValues.reset({
      investingobjective:  this.user.userothervalues.investingobjective || '',
      bestCommunicationMethod: this.user.userothervalues.bestCommunicationMethod || '',
      bestTimeToCall: this.user.userothervalues.bestTimeToCall || '',
      professionalField: this.user.userothervalues.professionalField || '',
      discordID: this.user.userothervalues.discordID || '',
      currentPortfolioSize: this.user.userothervalues.currentPortfolioSize || '',
      volunteer: this.user.userothervalues.volunteer || '',
      ipaddress: this.user.userothervalues.ipaddress || '',
    });
  }
  public getuserOtherValues() {
    var currentUser: User;
    this.selectUser$.subscribe(data => { currentUser = data; });
    let nuser: User = Utilities.userDTO(currentUser, this.authService.currentUser.uid);
    nuser.userothervalues.investingobjective = this.investingobjective.value;
    nuser.userothervalues.bestCommunicationMethod = this.bestCommunicationMethod.value;
    nuser.userothervalues.bestTimeToCall = this.bestTimeToCall.value;
    nuser.userothervalues.professionalField = this.professionalField.value;
    nuser.userothervalues.discordID = this.discordID.value;
    nuser.userothervalues.currentPortfolioSize = this.currentPortfolioSize.value;
    nuser.userothervalues.volunteer = this.volunteer.value;
    nuser.userothervalues.ipaddress = this.ipaddress.value;
    return nuser.userothervalues;
  }
  public save() {

    if (!this.userOtherValues.valid) {
      this.alertService.showValidationError();
      return;
    }
    var currentUser: User;
    this.selectUser$.subscribe(data => { currentUser = data; });
    let nuser: User = Utilities.userDTO(currentUser, this.authService.currentUser.uid);
    nuser.userothervalues.investingobjective = this.investingobjective.value;
    nuser.userothervalues.bestCommunicationMethod = this.bestCommunicationMethod.value;
    nuser.userothervalues.bestTimeToCall = this.bestTimeToCall.value;
    nuser.userothervalues.professionalField = this.professionalField.value;
    nuser.userothervalues.discordID = this.discordID.value;
    nuser.userothervalues.currentPortfolioSize = this.currentPortfolioSize.value;
    nuser.userothervalues.volunteer = this.volunteer.value;
    nuser.userothervalues.ipaddress = this.ipaddress.value;
    if (!this.updateFromUserList) {
      this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Other Values saved successfully!", MessageSeverity.success);
        }
      });
    }
    else {
      this.store$.dispatch(new UsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isListUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Other Values saved successfully!", MessageSeverity.success);
        }
      });
    }

  }

  ngOnChanges() {
    if (!this.updateFromUserList) {
      this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    }
    else {
      this.isListUserLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    }
    this.resetForm();
  }

  ngOnDestroy() {
  }
}
