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
  selector: 'app-optionstrade-edit-comment',
  templateUrl: './optiontrade-edit-comment.component.html',
  styleUrls: ['./optiontrade-edit-comment.component.scss']
})
export class OptionsTradeEditCommentComponent implements OnChanges, OnDestroy, AfterViewInit {

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
  showCloseOption: boolean;

  displayedColumns = ['notestype', 'notesvalue', 'notespostedby', 'createdon'];
  dataSource: MatTableDataSource<optionstradenotes>;

  //transDisplayedColumns = ['strikeprice', 'strikeprice2','premiumpaid', 'transtype', 'expdate'];
  transDisplayedColumns = [];
  transDataSource: MatTableDataSource<transdatadisplay>;

  tickerForm: FormGroup;
  tickerSaved$ = this.onOptionsTradeSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  get notesSection() {
    return this.tickerForm.get('notesSection');
  }

  get notes() {
    return this.notesSection.get('notes');
  }

  get isoptionactive() {
    return this.notesSection.get('isoptionactive');
  }

  get optionsellprice() {
    return this.notesSection.get('optionsellprice');
  }

  get optionexitdate() {
    return this.notesSection.get('optionexitdate');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    public dialogRef: MatDialogRef<OptionsTradeEditCommentComponent>,
    private cp: CurrencyPipe,
    private alertService: AlertService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { ticker: optionstrade, addAdditionalComments: boolean },
    private store$: Store<RootStoreState.State>
  ) {

    this.dataSource = new MatTableDataSource();
    this.transDataSource = new MatTableDataSource();

    this.loadingChannelIndicator$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoading);
    this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
    this.selectChannel$ = this.store$.select(ChannelStoreSelectors.selectChannels);

    this.loadingCurrentUserIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);


    this.ticker = data.ticker;
    this.showCloseOption = false;
    this.addAdditionalComments = data.addAdditionalComments;
    this.dataSource.data = this.ticker.notes;

    switch (this.ticker.spread) {
      case 'DEBIT SPREAD':
      case 'CREDIT SPREAD':
        this.transDisplayedColumns.push('strikeprice', 'strikeprice2', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'SINGLE':
        this.transDisplayedColumns.push('strikeprice', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'COVERED CALLS':
        this.transDisplayedColumns.push('strikeprice', 'strikeprice2', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'CALENDER':
        this.transDisplayedColumns.push('strikeprice', 'premiumpaid', 'transtype', 'expdate', 'selllegexpdate');
        break;
    }
    this.transDataSource.data = this.ticker.trans;
    this.loadData();
    this.buildForm();
  }
  async loadData() {

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

  public toggle(event: MatSlideToggleChange) {
    this.showCloseOption = event.checked;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      notesSection: this.formBuilder.group({
        notes: ['', Validators.required],
        optionsellprice: [''],
        optionexitdate: [''],
        isoptionactive: ['']
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
      notesSection: {
        notes: '',
        optionsellprice: '',
        optionexitdate: '',
        isoptionactive: ''
      }
    });
  }

  public beginEdit() {
    this.isEditMode = true;
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

  public save() {

    //if (!this.form.submitted) {
    //  // Causes validation to update.
    //  this.form.onSubmit(null);
    //  return;
    //}
    //if (!this.notesSection.valid) {
    //  this.alertService.showValidationError();
    //  return;
    //}

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const newNotes = this.getNotes();
    //const stokeNotes = this.getStockNotes();
    const updatedTicker = this.assignNotes(newNotes);
    if (newNotes.length > 0 && this.ticker.broadcastTrade) {
      var html = this.getBroadcastMessage(newNotes, this.ticker.stocknotes);
      console.log(html);
    }
    
    this.store$.dispatch(new OptionsTradeStoreActions.UpdateOptionsTradeNoteRequestAction({ optionstrade: updatedTicker, notes: newNotes, stocknotes: this.ticker.stocknotes }))
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

    //if (obroadcastinfo.channel.length > 0) {
    //  this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    //  this.isOptionsTradeLoaded$.subscribe(result => {
    //    if (result) {
    //      this.appService.sendTelegramMessage(obroadcastinfo).subscribe(
    //        data => { console.log(data) },
    //        error => this.alertService.showMessage("Error Sending Broadcast Message."));
    //    }
    //  }
    //  )
    //}
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



  assignNotes(newNotes: optionstradenotes[]): optionstrade {
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



    dailytickeredit.isoptionactive = !this.isoptionactive.value;
    dailytickeredit.isstockactive = this.ticker.isstockactive;


    dailytickeredit.optionexitdate = this.optionexitdate.value;
    dailytickeredit.optionsellprice = this.optionsellprice.value;

    dailytickeredit.stockexitdate = this.ticker.stockexitdate;
    dailytickeredit.stocksellprice = this.ticker.stocksellprice;


    let optionstradenotesarray: optionstradenotes[] = [];
    for (var i = 0; i < this.ticker.notes.length; i++) {
      let oOptionstradenotes: optionstradenotes = new optionstradenotes(
        this.ticker.notes[i].notestype, this.ticker.notes[i].notesvalue, this.ticker.notes[i].createdon, this.ticker.notes[i].notespostedby
      );
      optionstradenotesarray.push(oOptionstradenotes);
    }
    if (newNotes.length > 0) {
      optionstradenotesarray.push(newNotes[0]);
    }
    

    let stocknotesarray: optionstradenotes[] = [];
    for (var i = 0; i < this.ticker.stocknotes.length; i++) {
      let oStocknotes: optionstradenotes = new optionstradenotes(
        this.ticker.stocknotes[i].notestype, this.ticker.stocknotes[i].notesvalue, this.ticker.stocknotes[i].createdon, this.ticker.stocknotes[i].notespostedby
      );
      stocknotesarray.push(oStocknotes);
    }
    dailytickeredit.notes = optionstradenotesarray;
    dailytickeredit.stocknotes = stocknotesarray;
    return dailytickeredit;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  private getBroadcastMessage(nNotes: optionstradenotes[], nStokeNotes: optionstradenotes[]) {
    var trans: string = '';
    for (var i = 0; i < this.ticker.trans.length; i++) {
      trans = trans.length > 0 ? trans + '|' + this.ticker.trans[i].strikeprice + '-' + this.ticker.trans[i].premiumpaid + '-' + this.ticker.trans[i].transtype + '-' + moment(this.checkDate(this.ticker.trans[i].expdate)).format("MM/DD/YYYY") :
        this.ticker.trans[i].strikeprice + '-' + this.ticker.trans[i].premiumpaid + '-' + this.ticker.trans[i].transtype + '-' + moment(this.checkDate(this.ticker.trans[i].expdate)).format("MM/DD/YYYY");
    }
    var heading: string = !this.addAdditionalComments ? "Additional Comments" : "Closed ticker"
    var optionhtml = '';
    var stockhtml = '';

    var html = `
      <b> Alert – ${heading}</b>
      <b>Symbol:</b> ${this.ticker.symbol}
      <b>Posted By: </b> ${this.ticker.postedby}
      <b>Posted On: </b> ${moment(Utilities.transformSecondsToDate(this.ticker.createdon)).format("MMM-dddd-YYYY")}
      ==========================================`;

    if (this.ticker.trans.length > 0) {

      switch (this.ticker.spread) {
        case 'SINGLE':
          optionhtml = `
       <b>Option Trade - </b> ${this.ticker.type}
       <b>Type</b> ${this.ticker.spread}
       <b>Strike Price</b> ${this.cp.transform(this.ticker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${this.ticker.trans[0].premiumpaid ? this.cp.transform(this.ticker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${this.ticker.trans[0].transtype}
       <b>Expiry Date</b> ${moment(Utilities.transformSecondsToDate(this.ticker.trans[0].expdate)).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${this.ticker.notes.length > 0 ? nNotes[0].notesvalue: "N/A"}
      ==========================================`;
          break;
        case 'COVERED CALLS':
          optionhtml = `
       <b>Option Trade - </b> ${this.ticker.type}
       <b>Type</b> ${this.ticker.spread}
       <b>Strike Price</b> ${this.cp.transform(this.ticker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Stock Price</b> ${this.cp.transform(this.ticker.trans[0].strikeprice2, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${this.ticker.trans[0].premiumpaid ? this.cp.transform(this.ticker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${this.ticker.trans[0].transtype}
       <b>Expiry Date</b> ${moment(Utilities.transformSecondsToDate(this.ticker.trans[0].expdate)).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${this.ticker.notes.length > 0 ? nNotes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
        case 'DEBIT SPREAD':
        case 'CREDIT SPREAD':
          optionhtml = `
       <b>Option Trade - </b> ${this.ticker.type}
       <b>Type</b> ${this.ticker.spread}
       <b>Buy Leg Strike Price</b> ${this.cp.transform(this.ticker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Sell Leg Strike Price</b> ${this.cp.transform(this.ticker.trans[0].strikeprice2, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${this.ticker.trans[0].premiumpaid ? this.cp.transform(this.ticker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${this.ticker.trans[0].transtype}
       <b>Expiry Date</b> ${moment(Utilities.transformSecondsToDate(this.ticker.trans[0].expdate)).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${this.ticker.notes.length > 0 ? nNotes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
        case 'CALENDER':
          optionhtml = `
       <b>Option Trade - </b> ${this.ticker.type}
       <b>Type</b> ${this.ticker.spread}
       <b>Strike Price</b> ${this.cp.transform(this.ticker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${this.ticker.trans[0].premiumpaid ? this.cp.transform(this.ticker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${this.ticker.trans[0].transtype}
       <b>Buy Leg Date</b> ${moment(Utilities.transformSecondsToDate(this.ticker.trans[0].expdate)).format("MM/DD/YYYY")}
       <b>Sell Leg Date</b> ${moment(Utilities.transformSecondsToDate(this.ticker.trans[0].selllegexpdate)).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${this.ticker.notes.length > 0 ? nNotes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
      }
}
    html = html.concat(optionhtml.length > 0 ? optionhtml : '', stockhtml.length > 0 ? stockhtml : '');
    return html;
  }

  private getNotes(): optionstradenotes[] {
    var currentUserName = this.currentContextUser.userprofile.firstName + ' ' + this.currentContextUser.userprofile.lastName;
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const notesModel = this.notesSection.value;
    let oOptionstradenotes: optionstradenotes = new optionstradenotes();
    let optionstradenotesarray: optionstradenotes[] = [];
    if (notesModel.notes.length > 0) {
      let ooptionstradenotes: optionstradenotes = new optionstradenotes(!this.addAdditionalComments ? 'OTHER' : 'CLOSED', notesModel.notes, new Date(now_utc), currentUserName);
      optionstradenotesarray.push(ooptionstradenotes);
    }
    return optionstradenotesarray;
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
