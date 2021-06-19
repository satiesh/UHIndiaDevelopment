// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component,  ViewChild, Input,  OnInit } from '@angular/core';
import {Observable } from 'rxjs';
import { investorlevel, investorleveldisplay } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions, UsersStoreSelectors, UsersStoreActions} from '@app/store';
import { User } from '@app/models/user';
import { InvestorLevelStoreSelectors, InvestorLevelStoreActions } from '../../../store/investorlevel-data';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Utilities, AlertService, MessageSeverity, AuthService } from '../../../services';


@Component({
  selector: 'app-investorlevel-info',
  templateUrl: './user-investorlevel.component.html',
  styleUrls: ['./user-investorlevel.component.scss']
})

export class UserInvestorLevelComponent implements OnInit{
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

  isCurrentUserLoaded$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  selectUser$: Observable<User>;
  dataSource: MatTableDataSource<investorleveldisplay>;
  investorleveldisplayarray: investorleveldisplay[] = [];
  selectedinvestorlevel: string[] = [];
  updateMade: boolean = false;


  
  loadingInvestorLevelIndicator$: Observable<boolean>;
  isInvestorLevelLoaded$: Observable<boolean>;
  selectInvestorLevel$: Observable<investorlevel[]>;
  selectedLevel: investorleveldisplay;

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(private alertService: AlertService,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>)
  {
  this.dataSource = new MatTableDataSource<investorleveldisplay>();
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
    this.loadingInvestorLevelIndicator$ = this.store$.pipe(select(InvestorLevelStoreSelectors.getInvestorLevelLoading));
    this.isInvestorLevelLoaded$ = this.store$.pipe(select(InvestorLevelStoreSelectors.getInvestorLevelLoaded));
    this.selectInvestorLevel$ = this.store$.pipe(select(InvestorLevelStoreSelectors.getInvestorLevel));
    this.loadData();
  }

  async loadData() {

    await this.isInvestorLevelLoaded$.subscribe((result: boolean) => {
      if (!result) { this.store$.dispatch(new InvestorLevelStoreActions.InvestorLevelRequestAction()); }
      else {
        this.selectInvestorLevel$.subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            let invleveldisplay: investorleveldisplay = new investorleveldisplay(
              data[i].id, data[i].Name, this.getLevelIsActive(data[i].id)
            )
            if (invleveldisplay.IsActive) {
              this.selectedLevel = invleveldisplay
            }
            this.investorleveldisplayarray.push(invleveldisplay);
          }
          this.dataSource.data = this.investorleveldisplayarray;

        })
      }
    });
  }

  selectedlevel(element) {
    this.selectedLevel = element;
    this.updateMade = true;
  }
  public getSelectedvalues() {
    return this.selectedLevel.id;
  }

  save() {
    var currentUser: User;
    this.selectUser$.subscribe(data => { currentUser = data; });
    let nuser: User = Utilities.userDTO(currentUser, this.authService.currentUser.uid);
    nuser.userothervalues.investorLevel = this.selectedLevel.id;
    if (!this.updateFromUserList) {
    this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
    this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
      if (result) {
        this.alertService.showMessage("DATA UPDATE", "Investor level saved successfully!", MessageSeverity.success);
      }
    });
    }
    else {
      this.store$.dispatch(new UsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isListUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Investor level saved successfully!", MessageSeverity.success);
        }
      });
    }
  }

  getLevelIsActive(id: string): boolean {
    var returnValue: boolean = false;
    if (this.user.userothervalues && this.user.userothervalues.investorLevel) {
      var strArr = this.user.userothervalues.investorLevel.split(',');
      if (strArr.filter(a => a == id).length > 0) {
        returnValue = true;
      }
    }
    return returnValue;
  }
}
