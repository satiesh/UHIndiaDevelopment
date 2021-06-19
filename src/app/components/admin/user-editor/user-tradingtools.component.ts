// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tradingtoolsdisplay, tradingtools } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, TradingToolsStoreSelectors, TradingToolsStoreActions, CurrentUsersStoreActions, CurrentUsersStoreSelectors, UsersStoreSelectors, UsersStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Utilities, AlertService, MessageSeverity, AuthService } from '../../../services';


@Component({
  selector: 'app-tradingtools-info',
  templateUrl: './user-tradingtools.component.html',
  styleUrls: ['./user-tradingtools.component.scss']
})

export class UserTradingToolsComponent implements OnInit {
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


  displayedColumns = ['Name', 'Description', 'Type', 'IsActive'];
  @Input() user: User;
  @Input() isEditMode = false;
  @Input() updateFromUserList: boolean = false;

  isCurrentUserLoaded$: Observable<boolean>;
  isListUserLoaded$: Observable<boolean>;
  selectUser$: Observable<User>;
  updateMade: boolean = false;

  dataSource: MatTableDataSource<tradingtoolsdisplay>;
  tradingtoolsdisplayarray: tradingtoolsdisplay[] = [];

  loadingTradingToolsIndicator$: Observable<boolean>;
  isTradingToolsLoaded$: Observable<boolean>;
  selectTradingTools$: Observable<tradingtools[]>;



  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(private alertService: AlertService,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>) {
    this.dataSource = new MatTableDataSource<tradingtoolsdisplay>();
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

    this.loadingTradingToolsIndicator$ = this.store$.pipe(select(TradingToolsStoreSelectors.getTradingToolsLoading));
    this.isTradingToolsLoaded$ = this.store$.pipe(select(TradingToolsStoreSelectors.getTradingToolsLoaded));
    this.selectTradingTools$ = this.store$.pipe(select(TradingToolsStoreSelectors.getTradingTools));

    this.loadData();
  }

  async loadData() {

    await this.isTradingToolsLoaded$.subscribe((result: boolean) => {
      if (!result) { this.store$.dispatch(new TradingToolsStoreActions.ToolsTradingRequestAction()); }
      else {
        this.selectTradingTools$.subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            let invleveldisplay: tradingtoolsdisplay = new tradingtoolsdisplay(
              data[i].id, data[i].Name, data[i].Description, data[i].Type, this.getToolIsActive(data[i].id)
            )
            this.tradingtoolsdisplayarray.push(invleveldisplay);
          }
          this.dataSource.data = this.tradingtoolsdisplayarray;
        });
      }
    });
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
    var selectedToolsId: string[] = [];
    this.dataSource.data.forEach(row => {
      if (row.IsActive) {
        selectedToolsId.push(row.id);
      }
    }
    );
    var currentUser: User;
    this.selectUser$.subscribe(data => { currentUser = data; });
    let nuser: User = Utilities.userDTO(currentUser, this.authService.currentUser.uid);
    nuser.userothervalues.tradingTools = selectedToolsId.join();
    if (!this.updateFromUserList) {
     this.store$.dispatch(new CurrentUsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isCurrentUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Trading tools saved successfully!", MessageSeverity.success);
        }
      });
    }
    else {
      this.store$.dispatch(new UsersStoreActions.UpdateUsersOtherValuesRequestAction(nuser));
      this.isListUserLoaded$.subscribe((result: Boolean) => {
        if (result) {
          this.alertService.showMessage("DATA UPDATE", "Trading tools saved successfully!", MessageSeverity.success);
        }
      });
    }

  }

  getToolIsActive(id: string): boolean {
    var returnValue: boolean = false;
    if (this.user.userothervalues && this.user.userothervalues.tradingTools) {
      var strArr = this.user.userothervalues.tradingTools.split(',');
      if (strArr.filter(a => a == id).length > 0) {
        returnValue = true;
      }
    }
    return returnValue;
  }
}
