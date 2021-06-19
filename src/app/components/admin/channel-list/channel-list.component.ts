// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { fadeInOut, AlertService, AccountService, Utilities, MessageSeverity } from '@app/services';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { channel, Permission } from '@app/models';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { RootStoreState, ChannelStoreSelectors, ChannelStoreActions } from '@app/store';
import { EditChannelDialogComponent } from '../channel-dialog/channel-dialog.component';




@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
  animations: [fadeInOut]
})

export class ChannelListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['name', 'accountsid', 'authtoken', 'createdon'];
  dataSource: MatTableDataSource<channel>;

  loadingIndicator$: Observable<boolean>;
  isChannelLoaded$: Observable<boolean>;
  selectChannel$: Observable<channel[]>;

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {


    if (this.canManageChannel) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoading);
    this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
    this.selectChannel$ = this.store$.select(ChannelStoreSelectors.selectChannels);
    this.loadData();
  }

  async loadData() {

    await this.isChannelLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new ChannelStoreActions.ChannelRequestAction());
      }
      else {
        this.selectChannel$.subscribe(
          channel => this.onDataLoadSuccessful(channel),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }

  private onDataLoadSuccessful(channelData: channel[]) {
    this.alertService.stopLoadingMessage();
    this.dataSource.data = channelData;
  }
  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, header) => data[header];
  }

  editChannel(channel?: channel) {
    const dialogRef = this.dialog.open(EditChannelDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { channel: channel }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }
  reloadChannel() {
    this.store$.dispatch(new ChannelStoreActions.ChannelRequestAction());
    this.selectChannel$.subscribe(
      users => this.onDataLoadSuccessful(users),
      error => this.onDataLoadFailed(error)
    );
  }

  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  get canManageChannel() {
    return this.accountService.userHasPermission(Permission.manageCoupons);
  }

  get canViewChannel() {
    return this.accountService.userHasPermission(Permission.viewCoupons);
  }
}
