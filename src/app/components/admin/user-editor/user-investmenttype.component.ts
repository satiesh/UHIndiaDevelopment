// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { investmenttypes, investmenttypesdisplay } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, InvestmentTypesStoreSelectors, InvestmentTypesStoreActions, CurrentUsersStoreActions, CurrentUsersStoreSelectors, UsersStoreSelectors, UsersStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Utilities, AlertService, MessageSeverity, AuthService } from '../../../services';


@Component({
  selector: 'app-investmenttype-info',
  templateUrl: './user-investmenttype.component.html',
  styleUrls: ['./user-investmenttype.component.scss']
})

export class UserInvestmentTypeComponent implements OnInit {
  @ViewChild('form', { static: true })
  private sort: MatSort;
  private paginator: MatPaginator;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  displayedColumns = ['Name', 'IsActive'];
  @Input() user: User;
  @Input() isEditMode = false;
  @Input() updateFromUserList: boolean;

  dataSource: MatTableDataSource<investmenttypesdisplay>;
  investmenttypesdisplayarray: investmenttypesdisplay[] = [];
  updateMade: boolean= false;
  isCurrentUserLoaded$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  selectUser$: Observable<User>;
  selectedinvestorlevel: string[] = [];



  loadingIndicator$: Observable<boolean>;
  isInvestmentTypesLoaded$: Observable<boolean>;
  selectInvestmentTypes$: Observable<investmenttypes[]>;


  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(private alertService: AlertService,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>) {
    this.dataSource = new MatTableDataSource<investmenttypesdisplay>();
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
    this.loadingIndicator$ = this.store$.pipe(select(InvestmentTypesStoreSelectors.getInvestmentTypesLoading));
    this.isInvestmentTypesLoaded$ = this.store$.pipe(select(InvestmentTypesStoreSelectors.getInvestmentTypesLoaded));
    this.selectInvestmentTypes$ = this.store$.pipe(select(InvestmentTypesStoreSelectors.getInvestmentTypes));

    this.loadData();
  }

  async loadData() {

    await this.isInvestmentTypesLoaded$.subscribe((result: boolean) => {
      if (!result) { this.store$.dispatch(new InvestmentTypesStoreActions.InvestmentTypesRequestAction()); }
      else {
        this.selectInvestmentTypes$.subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            let invleveldisplay: investmenttypesdisplay = new investmenttypesdisplay(
              data[i].id, data[i].Name, this.getTypeIsActive(data[i].id)
            )
            this.investmenttypesdisplayarray.push(invleveldisplay);
          }
          this.dataSource.data = this.investmenttypesdisplayarray;

        });
      }

    });
  }
  selectedlevel(element) {
    console.log(element);
  }

  madeChange() {
    this.updateMade = true;
  }

  public getSelectedvalues() {
    var selectedTypeId: string[] = [];
    this.dataSource.data.forEach(row => {
      if (row.IsActive) {
        selectedTypeId.push(row.id);
      }
    }
    );
    return selectedTypeId;
  }
  save() {
    var selectedTypeId: string[] = [];
    this.dataSource.data.forEach(row => {
      if (row.IsActive) {
        selectedTypeId.push(row.id);
      }
    }
    );
    var currentUser: User;
    this.selectUser$.subscribe(data => { currentUser = data; });
    let nuser: User = Utilities.userDTO(currentUser, this.authService.currentUser.uid);
    nuser.userothervalues.investmentType = selectedTypeId.join();
    if (!this.updateFromUserList) {
      this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Investment types saved successfully!", MessageSeverity.success);
        }
      });
    }
    else {
      this.store$.dispatch(new UsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isListUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Investment types saved successfully!", MessageSeverity.success);
        }
      });
    }
  }

  getTypeIsActive(id: string): boolean {
    var returnValue: boolean = false;
    if (this.user.userothervalues && this.user.userothervalues.investmentType) {
      var strArr = this.user.userothervalues.investmentType.split(',');
      if (strArr.filter(a => a == id).length > 0) {
        returnValue = true;
      }
    }
    return returnValue;
  }
}
