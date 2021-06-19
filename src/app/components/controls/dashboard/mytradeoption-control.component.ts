// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  AlertService,
  MessageSeverity, AuthService, AppService, Utilities
} from '@app/services';

import { Store, select } from '@ngrx/store';
import { RootStoreState, UserOptionTradeStoreSelectors, UserOptionTradeStoreActions, OptionsTradeStoreSelectors, OptionsTradeStoreActions } from '@app/store';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { useroptiontrades } from '@app/models/useroptiontrade';
import { optionstrade } from '../../../models';
import { OpenOptionTradeViewComponent } from '../../everydaytrades/openoptiontradeview.component';
import { ClosedOptionTradeViewComponent } from '../../everydaytrades/closedoptiontradeview.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mytradeoption-control',
  templateUrl: './mytradeoption-control.component.html',
  styleUrls: ['./mytradeoption-control.component.scss']
})
export class MYTradeOptionsComponent implements OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('form', { static: true })
  private form: NgForm;

  loadingUserOptionTradeIndicator$: Observable<boolean>;
  isUserOptionTradeLoaded$: Observable<boolean>;
  selectUserOptionTrade$: Observable<useroptiontrades[]>;

  loadingIndicator$: Observable<boolean>;
  isOptionsTradeLoaded$: Observable<boolean>;
  selectOptionsTrade$: Observable<optionstrade>;

  ouseroptiontrades: useroptiontrades[];
  oOptionsTrade: optionstrade[];

  loadingIndicator: boolean;
  recordFound: boolean = false;

  displayedColumns = ['symbol', 'postedBy', 'createdOn', 'actions'];
  dataSource: MatTableDataSource<optionstrade>;

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>
  ) {

    this.dataSource = new MatTableDataSource();
    this.loadingUserOptionTradeIndicator$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeLoading);
    this.isUserOptionTradeLoaded$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserOptionTradeLoaded);

    this.loadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.loadData();
  }
  async loadData() {
    this.isUserOptionTradeLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new UserOptionTradeStoreActions.UsersOptionsTradeRequestAction({ uid: this.authService.currentUser.uid }));
      }
    });

    await this.isOptionsTradeLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new OptionsTradeStoreActions.OptionsTradeRequestAction());
      }
    });


    this.isUserOptionTradeLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectUserOptionTrade$ = this.store$.select(UserOptionTradeStoreSelectors.selectUserTradesByType("option"));
        this.oOptionsTrade = [];
        this.recordFound = false;
        this.selectUserOptionTrade$.subscribe(
          uoptionstrade => {
            if (uoptionstrade.length > 0) {
             for (var i = 0; i < uoptionstrade.length; i++) {
                this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradeById(uoptionstrade[i].optiontradeid));
                this.selectOptionsTrade$.subscribe(
                  data => {
                    if (data && data.trans.length > 0) {
                      this.oOptionsTrade.push(data);
                    }
                  }
                )
              }
              this.dataSource.data = this.oOptionsTrade;
              this.recordFound = true;
            }
          },
          error => this.onDataLoadFailed(error))
      }
    });


  }

  reloadOptions() {

    this.isUserOptionTradeLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.oOptionsTrade = [];
        this.selectUserOptionTrade$.subscribe(
          uoptionstrade => {
            if (uoptionstrade.length > 0) {
              for (var i = 0; i < uoptionstrade.length; i++) {
                this.selectOptionsTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradeById(uoptionstrade[i].optiontradeid));
                this.selectOptionsTrade$.subscribe(
                  data => {
                    if (data && data.trans.length > 0 && data.isoptionactive) {
                      this.oOptionsTrade.push(data);
                    }
                    
                  }
                )
              }
              this.dataSource.data = this.oOptionsTrade;
              this.recordFound = true;
            }
            else {
              this.dataSource.data = this.oOptionsTrade;
              this.recordFound = false;
            }
          });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  ngOnDestroy() {
  }

  checkDate(dateData: any) {
    var dateWrapper = new Date(dateData);
    if (isNaN(dateWrapper.getDate())) {
      return Utilities.transformSecondsToDate(dateData);
    }
    else {
      return dateData;
    }
  }
  ViewOpenOptionComments(ticker?: optionstrade) {
    const dialogRef = this.dialog.open(OpenOptionTradeViewComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { ticker }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        if (u) {
          this.reloadOptions();
        }
      }
    });
  }

  ViewClosedOptionComments(ticker?: optionstrade) {
    const dialogRef = this.dialog.open(ClosedOptionTradeViewComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { ticker }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        //console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }
}
