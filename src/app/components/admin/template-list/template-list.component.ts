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
import { Permission, template } from '@app/models/';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootStoreState, UsersStoreSelectors, UsersStoreActions, CoursesStoreActions } from '@app/store';
import { EditUserDialogComponent } from '@app/components/admin/user-dialog/user-dialog.component';
import { User } from '@app/models/user';
import { NewUserDialogComponent } from '../user-new-dialog/user-new-dialog.component';
import { TemplateStoreSelectors, TemplateStoreActions } from '../../../store/template-data';
import { EditTemplateDialogComponent } from '../template-dialog/template-dialog.component';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  animations: [fadeInOut]
})

export class TemplateListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['name', 'description', 'isactive','createdon'];
  dataSource: MatTableDataSource<template>;
  sourceTemplate: template;

  loadingIndicator$: Observable<boolean>;
  isTemplatesLoaded$: Observable<boolean>;
  selectTemplates$: Observable<template[]>;


  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {


    if (this.canManageTemplates) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {

    this.loadingIndicator$ = this.store$.select(TemplateStoreSelectors.selectTemplatesLoading);
    this.isTemplatesLoaded$ = this.store$.select(TemplateStoreSelectors.selectTemplatesLoaded);
    this.selectTemplates$ = this.store$.select(TemplateStoreSelectors.selectTemplates);
    this.loadData();
  }

  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }

  async loadData() {

    await this.isTemplatesLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new TemplateStoreActions.TemplateRequestAction());
      }
      else {
        this.selectTemplates$.subscribe(
          templates => this.onDataLoadSuccessful(templates),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, header) => data[header];
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  private onDataLoadSuccessful(templateData: template[]) {
    this.alertService.stopLoadingMessage();
    this.dataSource.data = templateData;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }
  newUser(user?: User) {
    const dialogRef = this.dialog.open(NewUserDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { user: user, updateFromUserList: true }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }

  editTemplate(template?: template) {
    const dialogRef = this.dialog.open(EditTemplateDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        disableClose: true,
        data: { template: template }
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        console.log("After close" + u);
        //this.updateUsers(u);
      }
    });
  }
  reloadTemplates() {
    this.store$.dispatch(new TemplateStoreActions.TemplateRequestAction());
    this.selectTemplates$.subscribe(
      users => this.onDataLoadSuccessful(users),
      error => this.onDataLoadFailed(error)
    );
  }

  confirmDelete(template: template) {

    this.snackBar.open(`Delete ${template.name}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.store$.dispatch(new TemplateStoreActions.DeleteTemplateRequestAction(template))
        this.loadingIndicator$.subscribe(
          (loading: boolean) => {
            if (!loading) {
              this.alertService.stopLoadingMessage();
            }
          });
      });
  }

  get canManageTemplates() {
    return this.accountService.userHasPermission(Permission.manageTemplates);
  }

  get canViewTemplates() {
    return this.accountService.userHasPermission(Permission.viewTemplates);
  }


}
