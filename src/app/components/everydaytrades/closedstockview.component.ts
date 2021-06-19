// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input,  Inject, AfterViewInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subject } from 'rxjs';

import {
AuthService, Utilities
} from '@app/services';

import { optionstrade } from '@app/models';
import { Store, select } from '@ngrx/store';
import {
  RootStoreState

} from '@app/store';
import { MatTableDataSource } from '@angular/material/table';
import { optionstradenotes } from '@app/models/optionstradenotes';
import { User } from '@app/models/user';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-closedstock-view-comment',
  templateUrl: './closedstockview.component.html',
  styleUrls: ['./closedstockview.component.scss']
})
export class ClosedStockViewComponent implements OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('form', { static: true })
  private form: NgForm;

  currentContextUser: User;
  public isSaving = false;
  private onOptionsTradeSaved = new Subject<optionstrade>();
  @Input() ticker: optionstrade = new optionstrade();

  displayedColumns = ['notestype', 'notesvalue', 'notespostedby', 'createdon'];
  stockdataSource: MatTableDataSource<optionstradenotes>;

  constructor(
    public dialogRef: MatDialogRef<ClosedStockViewComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade },
    private store$: Store<RootStoreState.State>
  ) {

    this.stockdataSource = new MatTableDataSource();

    this.ticker = data.ticker;
    this.stockdataSource.data = this.ticker.stocknotes;

  }

  ngAfterViewInit() {
    this.stockdataSource.paginator = this.paginator;
    this.stockdataSource.sort = this.sort;
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


  cancel(): void {
    this.dialogRef.close(null);
  }


}
