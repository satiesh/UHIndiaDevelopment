// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

import {
  AlertService,
  MessageSeverity, AppTranslationService, AuthService, AppService, Utilities
} from '@app/services';

import { channel, channeldisplay, optionstrade, transdatadisplay } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, OptionsTradeStoreActions, ChannelStoreSelectors, ChannelStoreActions, OptionsTradeStoreSelectors, CurrentUsersStoreActions, CurrentUsersStoreSelectors } from '@app/store';
import { MatTableDataSource } from '@angular/material/table';
import { broadcastinfo } from '../../../models/broadcastinfo';
import { optionstradenotes } from '../../../models/optionstradenotes';
import { User } from '../../../models/user';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-stocktrade-comment',
  templateUrl: './stocktrade-comment.component.html',
  styleUrls: ['./stocktrade-comment.component.scss']
})
export class StockTradeCommentComponent implements OnChanges, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('form', { static: true })
  private form: NgForm;

  currentContextUser: User;
  public isSaving = false;
  private onOptionsTradeSaved = new Subject<optionstrade>();
  @Input() ticker: optionstrade = new optionstrade();
  @Input() addAdditionalComments: boolean;
  @Input() isEditMode = false;

  showBroadCast = false;

  loadingChannelIndicator$: Observable<boolean>;
  isChannelLoaded$: Observable<boolean>;
  selectChannel$: Observable<channel[]>;

  loadingCurrentUserIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User[]>;

  ELEMENT_DATA: channeldisplay[] = [];
  loadingIndicator: boolean;

  isOptionsTradeLoaded$: Observable<boolean>;
  showCloseStock: boolean;

  displayedColumns = ['notestype', 'notesvalue', 'notespostedby', 'createdon'];
  stockdataSource: MatTableDataSource<optionstradenotes>;


  tickerForm: FormGroup;
  tickerSaved$ = this.onOptionsTradeSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  get stocknotesSection() {
    return this.tickerForm.get('stocknotesSection');
  }

  get stocknotes() {
    return this.stocknotesSection.get('stocknotes');
  }

  get isstockactive() {
    return this.stocknotesSection.get('isstockactive');
  }

  get stocksellprice() {
    return this.stocknotesSection.get('stocksellprice');
  }

  get stockexitdate() {
    return this.stocknotesSection.get('stockexitdate');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    public dialogRef: MatDialogRef<StockTradeCommentComponent>,
    private cp: CurrencyPipe,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade, addAdditionalComments: boolean },
    private store$: Store<RootStoreState.State>
  ) {
    this.stockdataSource = new MatTableDataSource();

    this.loadingChannelIndicator$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoading);
    this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
    this.selectChannel$ = this.store$.select(ChannelStoreSelectors.selectChannels);

    this.loadingCurrentUserIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);


    this.ticker = data.ticker;
    this.showCloseStock = false
    this.addAdditionalComments = data.addAdditionalComments;

    this.stockdataSource.data = this.ticker.stocknotes;
    this.loadData();
    this.buildForm();
  }
  async loadData() {

    //await this.isChannelLoaded$.subscribe((result: boolean) => {
    //  if (!result) {
    //    this.store$.dispatch(new ChannelStoreActions.ChannelRequestAction());
    //  }
    //});

    await this.isChannelLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new ChannelStoreActions.ChannelRequestAction());
        this.loadingChannelIndicator$.subscribe(
          (loading: boolean) => {
          });
        this.selectChannel$.subscribe(
          dailyticker => this.onDataLoadSuccessful(dailyticker),
          error => this.onDataLoadFailed(error)
        );

      }
      else {
        this.selectChannel$.subscribe(
          dailyticker => this.onDataLoadSuccessful(dailyticker),
          error => this.onDataLoadFailed(error)
        );
      }
    });


    await this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    })
    await this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (result) {
        this.selectCurrentUser$.subscribe((data: User[]) => {
          if (data) {
            this.currentContextUser = data[0];
          }
        })
      }
    });
  }

  public toggleStock(event: MatSlideToggleChange) {
    this.showCloseStock = event.checked;
  }


  private SetLoadingIndicator(loading: boolean) {
    if (loading) {
    }
  }


  private onDataLoadSuccessful(dailyticker: channel[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.ELEMENT_DATA = [];
    for (var i = 0; i < dailyticker.length; i++) {
      for (var j = 0; j < dailyticker[i].channelgroup.length; j++) {
        let oChannelDisplay: channeldisplay = new channeldisplay();
        oChannelDisplay.channelname = dailyticker[i].channelgroup[j].name;
        oChannelDisplay.uniqueid = dailyticker[i].channelgroup[j].uniqueid;
        oChannelDisplay.group = dailyticker[i].name;
        oChannelDisplay.accountsid = dailyticker[i].accountsid;
        oChannelDisplay.authtoken = dailyticker[i].authtoken;
        oChannelDisplay.membergroup = dailyticker[i].membergroup;
        oChannelDisplay.selected = false;
        this.ELEMENT_DATA.push(oChannelDisplay);
      }
    }
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }


  ngAfterViewInit() {
    this.stockdataSource.paginator = this.paginator;
    this.stockdataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.ticker) {
    } else {
      this.ticker = new optionstrade();
    }
    this.resetForm();
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

  private buildForm() {
    this.tickerForm = this.formBuilder.group({
      stocknotesSection: this.formBuilder.group({
        stocknotes: ['', Validators.required],
        stocksellprice: [''],
        stockexitdate: [''],
        isstockactive: ['']
      })
    });
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.ticker) {
      this.ticker = new optionstrade();
    }

    this.tickerForm.reset({
      stocknotesSection: {
        stocknotes: '',
        stocksellprice: '',
        stockexitdate: '',
        isstockactive: ''
      }
    });
  }

  public beginEdit() {
    this.isEditMode = true;
  }

  public save() {

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    //const newNotes = this.getNotes();
    const stokeNotes = this.getStockNotes();

    const updatedTicker = this.assignNotes(stokeNotes);

    if (stokeNotes.length > 0 && this.ticker.broadcastTrade) {

      var html = this.getBroadcastMessage(this.ticker.notes, stokeNotes);
      console.log(html);
    }


    this.store$.dispatch(new OptionsTradeStoreActions.UpdateOptionsTradeNoteRequestAction({ optionstrade: updatedTicker, notes: this.ticker.notes, stocknotes: stokeNotes }))
    const broadcastlist = this.getBroadcastChannels();
    let obroadcastinfo: broadcastinfo = new broadcastinfo(html, broadcastlist);
    if (obroadcastinfo.channel.length > 0 && this.ticker.broadcastTrade) {
      this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
      this.isOptionsTradeLoaded$.subscribe(result => {
        if (result) {
          this.appService.sendTelegramMessage(obroadcastinfo).subscribe(
            //data => this.saveCompleted(data),
            //error => this.saveFailed(error));
            data => {
              this.resetForm();
              //this.isEditMode = false;
              //this.alertService.resetStickyMessage();
              this.alertService.showMessage("Saved data and send message successfully");
              this.alertService.stopLoadingMessage();
              this.dialogRef.close(updatedTicker);
            },
            error => {
              this.alertService.showMessage("Error Sending Broadcast Message.")
              this.alertService.stopLoadingMessage();
              this.dialogRef.close(updatedTicker);
            });
        }
      }
      )
    }
    else {
      this.onOptionsTradeSaved.next(this.ticker);
      this.alertService.stopLoadingMessage();
      this.dialogRef.close(updatedTicker);
    }
  }

  private getBroadcastChannels(): channeldisplay[] {
    console.log(this.ticker.postedFor)
    let ochanneldisplay = [];
    for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
      console.log(this.ELEMENT_DATA[i]);
      if (this.ELEMENT_DATA[i].membergroup.trim() == 'SILVER MEMBERS') {
        ochanneldisplay.push(this.ELEMENT_DATA[i]);
      }
      else if (this.ELEMENT_DATA[i].membergroup.trim() == 'GOLD MEMBERS') {
        ochanneldisplay.push(this.ELEMENT_DATA[i]);
      }
      else if (this.ELEMENT_DATA[i].membergroup.trim() == 'PLATINUM MEMBERS') {
        ochanneldisplay.push(this.ELEMENT_DATA[i]);
      }
    }

    let index: number;
    switch (this.ticker.postedFor) {
      case "GOLD MEMBERS":
        index = ochanneldisplay.findIndex(d => d.membergroup === 'SILVER MEMBERS'); //find index in your array
        ochanneldisplay.splice(index, 1);//remove element from array
        break;
      case "PLATINUM MEMBERS":
        index = ochanneldisplay.findIndex(d => d.membergroup === 'SILVER MEMBERS'); //find index in your array
        ochanneldisplay.splice(index, 1);//remove element from array
        index = ochanneldisplay.findIndex(d => d.membergroup === 'GOLD MEMBERS'); //find index in your array
        ochanneldisplay.splice(index, 1);//remove element from array
        break;
    }
    console.log(ochanneldisplay);
    return ochanneldisplay;
  }



  assignNotes(newStockNotes: optionstradenotes[]): optionstrade {
    let dailytickeredit: optionstrade = new optionstrade();
    dailytickeredit.id = this.ticker.id;
    dailytickeredit.symbol = this.ticker.symbol;
    dailytickeredit.spread = this.ticker.spread;
    dailytickeredit.broadcastTrade = this.ticker.broadcastTrade
    dailytickeredit.type = this.ticker.type;
    dailytickeredit.postedby = this.ticker.postedby;
    dailytickeredit.postedFor = this.ticker.postedFor;
    dailytickeredit.createdon = this.ticker.createdon;
    dailytickeredit.createdby = this.ticker.createdby;
    dailytickeredit.trans = this.ticker.trans;
    dailytickeredit.isactive = !this.addAdditionalComments ? this.ticker.isactive : false;
    dailytickeredit.currentStockPrice = this.ticker.currentStockPrice;
    dailytickeredit.aboveResistance = this.ticker.aboveResistance;
    dailytickeredit.belowResistance = this.ticker.belowResistance;
    dailytickeredit.stopLoss = this.ticker.stopLoss;
    dailytickeredit.support = this.ticker.support;
    dailytickeredit.isoptionactive = this.ticker.isoptionactive;
    dailytickeredit.optionexitdate = this.ticker.optionexitdate;
    dailytickeredit.optionsellprice = this.ticker.optionsellprice;
    dailytickeredit.isstockactive = !this.isstockactive.value;
    dailytickeredit.stockexitdate = this.stockexitdate.value;
    dailytickeredit.stocksellprice = this.stocksellprice.value;


    let optionstradenotesarray: optionstradenotes[] = [];
    for (var i = 0; i < this.ticker.notes.length; i++) {
      let oOptionstradenotes: optionstradenotes = new optionstradenotes(
        this.ticker.notes[i].notestype, this.ticker.notes[i].notesvalue, this.ticker.notes[i].createdon, this.ticker.notes[i].notespostedby
      );
      optionstradenotesarray.push(oOptionstradenotes);
    }

    let stocknotesarray: optionstradenotes[] = [];
    for (var i = 0; i < this.ticker.stocknotes.length; i++) {
      let oStocknotes: optionstradenotes = new optionstradenotes(
        this.ticker.stocknotes[i].notestype, this.ticker.stocknotes[i].notesvalue, this.ticker.stocknotes[i].createdon, this.ticker.stocknotes[i].notespostedby
      );
      stocknotesarray.push(oStocknotes);
    }

    if (newStockNotes.length > 0) {
      stocknotesarray.push(newStockNotes[0]);
    }

    dailytickeredit.notes = optionstradenotesarray;
    dailytickeredit.stocknotes = stocknotesarray;
    return dailytickeredit;
  }

  private getBroadcastMessage(nNotes: optionstradenotes[], nStokeNotes: optionstradenotes[]) {
    var heading: string = !this.addAdditionalComments ? "Additional Comments" : "Closed ticker"
    var stockhtml = '';

    var html = `
      <b> Alert – ${heading}</b>
      <b>Symbol:</b> ${this.ticker.symbol}
      <b>Posted By: </b> ${this.ticker.postedby}
      <b>Posted On: </b> ${moment(Utilities.transformSecondsToDate(this.ticker.createdon)).format("MMM-dddd-YYYY")}
      ================================================================================================ `;
    if (this.ticker.currentStockPrice.length > 0) {
      stockhtml = `
        <b>Stock Trade</b>
        <b>Current Stock Price:</b> ${this.cp.transform(this.ticker.currentStockPrice, 'USD', 'symbol', '1.2-2')}
        <b>Above Resistance:</b> ${this.ticker.aboveResistance}
        <b>Below Resistance:</b> ${this.ticker.belowResistance}
        <b>Stop Loss:</b> ${this.ticker.stopLoss}
        <b>Support:</b> ${this.ticker.support}
        <b>Stock Notes:</b> ${nStokeNotes[0].notesvalue}
        ================================================================================================ `;
    };
    html = html.concat(stockhtml.length > 0 ? stockhtml : '');
    return html;
  }

  //private getNotes(): optionstradenotes[] {
  //  var currentUserName = this.currentContextUser.userprofile.firstName + ' ' + this.currentContextUser.userprofile.lastName;
  //  var date = new Date();
  //  var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
  //    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

  //  const notesModel = this.notesSection.value;
  //  let oOptionstradenotes: optionstradenotes = new optionstradenotes();
  //  let optionstradenotesarray: optionstradenotes[] = [];
  //  if (notesModel.notes.length > 0) {
  //    let ooptionstradenotes: optionstradenotes = new optionstradenotes(!this.addAdditionalComments ? 'OTHER' : 'CLOSED', notesModel.notes, new Date(now_utc), currentUserName);
  //    optionstradenotesarray.push(ooptionstradenotes);
  //  }
  //  return optionstradenotesarray;
  //}

  private getStockNotes(): optionstradenotes[] {
    var currentUserName = this.currentContextUser.userprofile.firstName + ' ' + this.currentContextUser.userprofile.lastName;
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const notesModel = this.stocknotesSection.value;
    let oOptionstradenotes: optionstradenotes = new optionstradenotes();
    let optionstradenotesarray: optionstradenotes[] = [];
    if (notesModel.stocknotes.length > 0) {
      let ooptionstradenotes: optionstradenotes = new optionstradenotes(!this.addAdditionalComments ? 'OTHER' : 'CLOSED', notesModel.stocknotes, new Date(now_utc), currentUserName);
      optionstradenotesarray.push(ooptionstradenotes);
    }
    return optionstradenotesarray;
  }


  cancel(): void {
    this.dialogRef.close(null);
  }

  intersperse<T>(elements: readonly T[], separator: T): T[] {
    const newElements = [];
    for (let i = 0; i < elements.length; i++) {
      if (i !== 0) {
        newElements.push(separator);
      }
      newElements.push(elements[i]);
    }
    return newElements;
  }

  private saveCompleted(ticker?: optionstrade) {
    if (ticker) {
      //this.raiseEventIfRolesModified(this.subscription, subscription);
      this.ticker = ticker;
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
