// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

import {
  AlertService, MessageSeverity, AuthService, AppService, Utilities
} from '@app/services';

import { channel, channeldisplay, optionstrade, transdatadisplay, ServiceSubscription } from '@app/models';
import { Store, select } from '@ngrx/store';
import {
  RootStoreState, OptionsTradeStoreActions, ChannelStoreSelectors, ChannelStoreActions, OptionsTradeStoreSelectors,
  CurrentUsersStoreActions, CurrentUsersStoreSelectors, UsersStoreSelectors, UsersStoreActions, SubscriptionStoreSelectors, SubscriptionStoreActions
} from '@app/store';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTableDataSource } from '@angular/material/table';
import { broadcastinfo } from '@app/models/broadcastinfo';
import { optionstradenotes } from '@app/models/optionstradenotes';
import { optionstradetrans } from '@app/models/optionstradetrans';
import { User } from '@app/models/user';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { TradeData } from '@app/models/azure/tradedata';
import { TOpstkTradeDatum } from '../../../models/azure/topstktradedatum';
import { TOptionTradeDatum } from '../../../models/azure/toptiontradedatum';
import { TOptionTradeNote } from '../../../models/azure/toptiontradenote';
import { TStockTradeNote } from '../../../models/azure/tstocktradenote';
import { TStockTradeDatum } from '../../../models/azure/tstocktradedatum';

interface TransactionTypes {
  name: string;
  sound: string;
}

@Component({
  selector: 'app-optionstrade-editor',
  templateUrl: './optionstrade-editor.component.html',
  styleUrls: ['./optionstrade-editor.component.scss']
})


export class OptionsTradeEditorComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('form', { static: true })
  private form: NgForm;

  showCalander: boolean = false;
  showSpread: boolean = false;
  showSingle: boolean = true;
  showCovered: boolean = false;
  isSaving: boolean = false;
  tradeData: TradeData = new TradeData();
  ELEMENT_DATA: channeldisplay[] = [];
  TRANS_ELEMENT_DATA: transdatadisplay[] = [];

  optionType: string;
  optionTypes: string[] = ['CALL', 'PUT'];

  spreadType: string;
  //spreadTypes: string[] = ['SINGLE', 'CALENDER', 'COVERED CALLS', 'DIAGONAL', 'STRADDLE', 'STRANGLE', 'DEBIT SPREAD', 'CREDIT SPREAD', 'BUTTERFLIES']
  spreadTypes: string[] = ['SINGLE', 'CALENDER', 'COVERED CALLS', 'DEBIT SPREAD', 'CREDIT SPREAD']

  postedfor: string;
  postedGroups: string[] = ['SILVER MEMBERS', 'GOLD MEMBERS', 'PLATINUM MEMBERS']

  selectedTrans: string
  transTypes: string[] = ['BUY', 'SELL'];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: '1200px',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  displayedColumns = ['channelname', 'group', 'selected'];
  dataSource: MatTableDataSource<channeldisplay>;

  transDisplayedColumns = [];
  transDataSource: MatTableDataSource<transdatadisplay>;
  currentContextUser: User;
  isNewOptionsTrade = false;
  showBroadCast = false;
  private onOptionsTradeSaved = new Subject<optionstrade>();
  formattedAmount;
  @Input() ticker: optionstrade = new optionstrade();
  @Input() isEditMode = true;

  loadingIndicator: boolean;

  loadingChannelIndicator$: Observable<boolean>;
  isChannelLoaded$: Observable<boolean>;
  selectChannel$: Observable<channel[]>;

  loadingTradingFeederIndicator$: Observable<boolean>;
  tradingFeederLoaded$: Observable<boolean>;
  tradingFeeder$: Observable<User[]>;

  loadingCurrentUserIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User[]>;

  loadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription>;



  isOptionsTradeLoaded$: Observable<boolean>;

  tickerForm: FormGroup;
  tickerSaved$ = this.onOptionsTradeSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  get symbolSection() {
    return this.tickerForm.get('symbolSection');
  }

  get entrySection() {
    return this.tickerForm.get('entrySection');
  }
  get transdetails() {
    return this.tickerForm.get('transdetails');
  }
  get notesSection() {
    return this.tickerForm.get('notesSection');
  }
  get stockSection() {
    return this.tickerForm.get('stockSection');
  }

  get strikeprice() {
    return this.transdetails.get('strikeprice');
  }

  get strikePrice2() {
    return this.transdetails.get('strikePrice2');
  }

  get premiumpaid() {
    return this.transdetails.get('premiumpaid');
  }
  get transtype() {
    return this.transdetails.get('transtype');
  }
  get expdate() {
    return this.transdetails.get('expdate');
  }
  get selllegexpdate() {
    return this.transdetails.get('selllegexpdate');
  }

  get notes() {
    return this.notesSection.get('notes');
  }
  get symbol() {
    return this.symbolSection.get('symbol');
  }
  get broadcastTrade() {
    return this.symbolSection.get('broadcastTrade');
  }
  get postedFor() {
    return this.symbolSection.get('postedFor');
  }

  get postedBy() {
    return this.symbolSection.get('postedBy');
  }

  get spread() {
    return this.entrySection.get('spread');
  }
  get type() {
    return this.entrySection.get('type');
  }

  get currentStockPrice() {
    return this.stockSection.get('currentStockPrice');
  }
  get aboveResistance() {
    return this.stockSection.get('aboveResistance');
  }
  get belowResistance() {
    return this.stockSection.get('belowResistance');
  }
  get stockComments() {
    return this.stockSection.get('stockComments');
  }
  get stopLoss() {
    return this.stockSection.get('stopLoss');
  }
  get support() {
    return this.stockSection.get('support');
  }

  get stockoftheday() {
    return this.stockSection.get('stockoftheday');
  }


  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private cp: CurrencyPipe,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource();
    this.transDataSource = new MatTableDataSource();
    this.loadingChannelIndicator$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoading);
    this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
    this.selectChannel$ = this.store$.select(ChannelStoreSelectors.selectChannels);


    this.loadingCurrentUserIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUsers);

    this.loadingTradingFeederIndicator$ = this.store$.select(UsersStoreSelectors.selectUsersLoading);
    this.tradingFeederLoaded$ = this.store$.select(UsersStoreSelectors.selectUsersLoaded);
    this.tradingFeeder$ = this.store$.select(UsersStoreSelectors.selectUserByRoleId("TradeFeeder"));

    this.loadingIndicator$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);

    this.loadData();
    this.buildForm();
  }
  ngOnInit() {


  }
  async loadData() {

    await this.tradingFeederLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new UsersStoreActions.UsersRequestAction());
      }
    })

    await this.isChannelLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new ChannelStoreActions.ChannelRequestAction());
        this.loadingChannelIndicator$.subscribe(
          (loading: boolean) => {
            this.SetLoadingIndicator(loading)
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

    await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) { this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction()); }
    });


  }
  private SetLoadingIndicator(loading: boolean) {
    if (loading) {
      this.loadingIndicator = loading;
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
    this.dataSource.data = this.ELEMENT_DATA;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  ngOnChanges() {
    this.isNewOptionsTrade = true;
    this.ticker = new optionstrade();
    this.resetForm();
  }

  ngOnDestroy() {
  }

  public setUser(ticker?: optionstrade) {
    this.ticker = ticker;
    this.ngOnChanges();
  }

  private buildForm() {
    let regEx = '^\\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\\.[0-9][0-9])?$';
    var resistancepattern = /^([0-9]+(.[0-9]+)*,*)+$/;
    this.tickerForm = this.formBuilder.group({
      symbolSection: this.formBuilder.group({
        symbol: ['', Validators.required],
        postedBy: ['', Validators.required],
        postedFor: ['', Validators.required],
        broadcastTrade: ['']
      }),
      entrySection: this.formBuilder.group({
        spread: [''],
        type: [''],
      }),
      notesSection: this.formBuilder.group({
        notes: '',
      }),
      transdetails: this.formBuilder.group({
        strikeprice: ['', Validators.pattern(regEx)],
        strikePrice2: ['', Validators.pattern(regEx)],
        premiumpaid: ['', Validators.pattern(regEx)],
        transtype: [''],
        expdate: [''],
        selllegexpdate: ['']
      }),
      stockSection: this.formBuilder.group({
        currentStockPrice: ['', Validators.pattern(regEx)],
        aboveResistance: ['', Validators.pattern(resistancepattern)],
        belowResistance: ['', Validators.pattern(resistancepattern)],
        stockComments: [''],
        stopLoss: ['', Validators.pattern(regEx)],
        support: ['', Validators.pattern(regEx)],
        stockoftheday: ['']
      })
    });
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.ticker) {
      this.isNewOptionsTrade = true;
      this.ticker = new optionstrade();
    }

    this.tickerForm.reset({
      symbolSection: {
        symbol: this.ticker.symbol || '',
        postedBy: this.ticker.postedby || '',
        postedFor: this.ticker.postedFor || '',
        broadcastTrade: this.ticker.broadcastTrade || ''
      },
      entrySection: {
        spread: this.ticker.spread || '',
        type: this.ticker.type || ''
      },
      transdetails: {
        strikeprice: '',
        strikePrice2: '',
        premiumpaid: '',
        transtype: '',
        expdate: '',
        selllegexpdate: ''
      },
      stockSection: {
        currentStockPrice: this.ticker.currentStockPrice || '',
        aboveResistance: this.ticker.aboveResistance || '',
        belowResistance: this.ticker.belowResistance || '',
        stockComments: this.ticker.stocknotes || '',
        stopLoss: this.ticker.stopLoss || '',
        support: this.ticker.support || '',
        stockoftheday: this.ticker.stockoftheday || '',
      }
    });
  }

  public beginEdit() {
    this.isEditMode = true;
  }

  public save() {

    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.entrySection.valid) {
      this.alertService.showValidationError();
      return;
    }


    if (this.type.value.length > 0 && this.strikeprice.value.length <= 0 && this.transtype.value.length <= 0 && this.expdate.value.length <= 0) {
      this.alertService.showMessage("Data Missing", 'Please enter strikeprice, transaction type & expiry date before submitting the form.', MessageSeverity.error);
      return;
    }

    /*if ((this.type.value.length > 0 && this.TRANS_ELEMENT_DATA.length <= 0)) {
      this.alertService.showMessage("Entry Missing", 'Please enter option information before submitting the form.', MessageSeverity.error);
      return;
    }*/

    //else if (this.TRANS_ELEMENT_DATA.length <= 0 && this.currentStockPrice.value.length <= 0) {
    else if (this.strikeprice.value.length <= 0 && this.currentStockPrice.value.length <= 0) {
      this.alertService.showMessage("Entry Missing", 'Please enter stock information before submitting the form.', MessageSeverity.error);
      return;
    }

    if (this.currentStockPrice.value.length >= 1) {
      if (this.aboveResistance.value.length <= 0 && this.belowResistance.value.length <= 0 && this.stopLoss.value.length <= 0 && this.support.value.length <= 0) {
        this.alertService.showMessage("Data Missing", 'Please enter resistance, support & stop loss before submitting the form.', MessageSeverity.error);
        return;
      }
    }


    this.isSaving = true;
    this.alertService.resetStickyMessage();
    this.alertService.startLoadingMessage('Saving changes...');

    this.addToTable()
    const editedTicker = this.getEditedTicker();
    if (this.TRANS_ELEMENT_DATA.length > 0 || editedTicker.currentStockPrice.length > 0 && this.broadcastTrade.value) {
      var html = this.getBroadcastMessage(editedTicker);
      console.log(html);
    }

    //if (this.isNewOptionsTrade) {

    this.store$.dispatch(new OptionsTradeStoreActions.AddOptionsTradeRequestAction({ optionstrade: editedTicker }))

    console.log(JSON.stringify(this.tradeData));



    const broadcastlist = this.getBroadcastChannels();
    let obroadcastinfo: broadcastinfo = new broadcastinfo(html, broadcastlist);




    this.appService.sendToAzure(this.tradeData).subscribe(data => {
      console.log(data);
    })

    if (obroadcastinfo.channel.length > 0 && this.broadcastTrade.value) {

      this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
      this.isOptionsTradeLoaded$.subscribe(result => {
        if (result) {
          this.resetForm();
          this.isSaving = false;
          this.alertService.showMessage("Saved data successfully");
          this.alertService.stopLoadingMessage();
          this.router.navigateByUrl('auth/trades');
        }
      });


      //this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
      //this.isOptionsTradeLoaded$.subscribe(result => {
      //  if (result) {
      //    // send data to Azure sql server.

      //    this.appService.sendTelegramMessage(obroadcastinfo).subscribe(
      //      //data => this.saveCompleted(data),
      //      //error => this.saveFailed(error));
      //      data => {
      //        this.resetForm();
      //        this.isSaving = false;
      //        //this.isEditMode = false;
      //        //this.alertService.resetStickyMessage();
      //        this.alertService.showMessage("Saved data and send message successfully");
      //        this.alertService.stopLoadingMessage();
      //        this.router.navigateByUrl('auth/trades');

      //      },
      //      error => {
      //        this.alertService.showMessage("Error Sending Broadcast Message.")
      //        this.isSaving = false;
      //        this.alertService.stopLoadingMessage();
      //        this.router.navigateByUrl('auth/trades');
      //      });
      //  }
      //}
      //)
    }
    else {
      //this.isEditMode = false;
      //this.alertService.resetStickyMessage();
      // this.router.navigateByUrl('auth/admin/optionstrade');
      this.isOptionsTradeLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
      this.isOptionsTradeLoaded$.subscribe(result => {
        if (result) {
          this.resetForm();
          this.isSaving = false;
          this.alertService.showMessage("Saved data successfully");
          this.alertService.stopLoadingMessage();
          this.router.navigateByUrl('auth/trades');
        }
      });
    }
    this.onOptionsTradeSaved.next(this.ticker);
  }
  private saveOptionCompleted(data?: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    this.resetForm();

    this.onOptionsTradeSaved.next(this.ticker);
  }

  public addToTable() {
    //if (this.strikeprice.value.length <= 0 || this.transtype.value.length <= 0 || this.expdate.value.length <= 0) {
    //  this.alertService.showMessage("Data Missing", 'Please enter strikeprice, transaction type & expiry date before submitting the form.', MessageSeverity.error);
    //  //if (this.transdetails.invalid) {
    //  this.transdetails.get('strikeprice').markAsTouched();
    //  this.transdetails.get('strikePrice2').markAsTouched();
    //  this.transdetails.get('premiumpaid').markAsTouched();
    //  this.transdetails.get('transtype').markAsTouched();
    //  this.transdetails.get('expdate').markAsTouched();
    //  this.transdetails.get('selllegexpdate').markAsTouched();
    //  return;
    //}
    //this.TRANS_ELEMENT_DATA = [];
    let otransdatadisplay: transdatadisplay = new transdatadisplay(
      this.transdetails.get('strikeprice').value,
      this.transdetails.get('strikePrice2').value,
      this.transdetails.get('premiumpaid').value,
      this.transdetails.get('transtype').value,
      this.transdetails.get('expdate').value,
      this.transdetails.get('selllegexpdate').value
    );
    this.TRANS_ELEMENT_DATA.push(otransdatadisplay);
    this.transdetails.reset();
    this.transDataSource.data = this.TRANS_ELEMENT_DATA;
  }

  private getBroadcastMessage(editedTicker: optionstrade) {

    var trans: string = '';

    switch (editedTicker.spread) {
      case 'SINGLE':
        trans = 'Strike Price :' + editedTicker.trans[0].strikeprice.toString();
        trans = trans + 'Premium Paid :' + editedTicker.trans[0].premiumpaid ? editedTicker.trans[0].premiumpaid.toString() : 'N/A';
        trans = trans + 'Transaction Type :' + editedTicker.trans[0].transtype;
        trans = trans + 'Expiry Date :' + moment(editedTicker.trans[0].expdate).format("MM/DD/YYYY");
        break;

    }

    //for (var i = 0; i < editedTicker.trans.length; i++) {
    //  trans = trans.length > 0 ? trans + '|' + editedTicker.trans[i].strikeprice + '-' + editedTicker.trans[i].premiumpaid + '-' + editedTicker.trans[i].transtype + '-' + moment(editedTicker.trans[i].expdate).format("MM/DD/YYYY") :
    //    editedTicker.trans[i].strikeprice + '-' + editedTicker.trans[i].premiumpaid + '-' + editedTicker.trans[i].transtype + '-' + moment(editedTicker.trans[i].expdate).format("MM/DD/YYYY");
    //}

    var optionhtml = '';
    var stockhtml = '';

    var html = `
      <b> Alert – ${editedTicker.postedFor}</b>
      <b>Symbol:</b> ${editedTicker.symbol}
      <b>Posted By: </b> ${editedTicker.postedby}
      <b>Posted On: </b> ${moment(editedTicker.createdon).format("MMM-dddd-YYYY")}
      ==========================================`;
    if (editedTicker.trans.length > 0) {
      switch (editedTicker.spread) {
        case 'SINGLE':
          optionhtml = `
       <b>Option Trade - </b> ${editedTicker.type}
       <b>Type</b> ${editedTicker.spread}
       <b>Strike Price</b> ${this.cp.transform(editedTicker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${editedTicker.trans[0].premiumpaid ? this.cp.transform(editedTicker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${editedTicker.trans[0].transtype}
       <b>Expiry Date</b> ${moment(editedTicker.trans[0].expdate).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${editedTicker.notes.length > 0 ? editedTicker.notes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
        case 'COVERED CALLS':
          optionhtml = `
       <b>Option Trade - </b> ${editedTicker.type}
       <b>Type</b> ${editedTicker.spread}
       <b>Strike Price</b> ${this.cp.transform(editedTicker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Stock Price</b> ${this.cp.transform(editedTicker.trans[0].strikeprice2, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${editedTicker.trans[0].premiumpaid ? this.cp.transform(editedTicker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${editedTicker.trans[0].transtype}
       <b>Expiry Date</b> ${moment(editedTicker.trans[0].expdate).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${editedTicker.notes.length > 0 ? editedTicker.notes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
        case 'DEBIT SPREAD':
        case 'CREDIT SPREAD':
          optionhtml = `
       <b>Option Trade - </b> ${editedTicker.type}
       <b>Type</b> ${editedTicker.spread}
       <b>Buy Leg Strike Price</b> ${this.cp.transform(editedTicker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Sell Leg Strike Price</b> ${this.cp.transform(editedTicker.trans[0].strikeprice2, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${editedTicker.trans[0].premiumpaid ? this.cp.transform(editedTicker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${editedTicker.trans[0].transtype}
       <b>Expiry Date</b> ${moment(editedTicker.trans[0].expdate).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${editedTicker.notes.length > 0 ? editedTicker.notes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
        case 'CALENDER':
          optionhtml = `
       <b>Option Trade - </b> ${editedTicker.type}
       <b>Type</b> ${editedTicker.spread}
       <b>Strike Price</b> ${this.cp.transform(editedTicker.trans[0].strikeprice, 'USD', 'symbol', '1.2-2')}
       <b>Premium Paid</b> ${editedTicker.trans[0].premiumpaid ? this.cp.transform(editedTicker.trans[0].premiumpaid, 'USD', 'symbol', '1.2-2') : 'N/A'}
       <b>Transaction Type</b> ${editedTicker.trans[0].transtype}
       <b>Buy Leg Date</b> ${moment(editedTicker.trans[0].expdate).format("MM/DD/YYYY")}
       <b>Sell Leg Date</b> ${moment(editedTicker.trans[0].selllegexpdate).format("MM/DD/YYYY")}
       <b>Options Notes:</b> ${editedTicker.notes.length > 0 ? editedTicker.notes[0].notesvalue : "N/A"}
      ==========================================`;
          break;
      }

    }
    if (editedTicker.currentStockPrice.length > 0) {
      stockhtml = `
        <b>Stock Trade</b>
        <b>Current Stock Price:</b> ${this.cp.transform(editedTicker.currentStockPrice, 'USD', 'symbol', '1.2-2')}
        <b>Above Resistance:</b> ${editedTicker.aboveResistance}
        <b>Below Resistance:</b> ${editedTicker.belowResistance}
        <b>Stop Loss:</b> ${editedTicker.stopLoss}
        <b>Support:</b> ${editedTicker.support}
        <b>Stock Notes:</b> ${editedTicker.stocknotes.length > 0 ? editedTicker.stocknotes[0].notesvalue : "N/A"}
        ==========================================`;
    };
    html = html.concat(optionhtml.length > 0 ? optionhtml : '', stockhtml.length > 0 ? stockhtml : '');
    return html;
  }

  private getEditedTicker(): optionstrade {
    var currentUserName = this.currentContextUser.userprofile.firstName + ' ' + this.currentContextUser.userprofile.lastName;
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const formModel = this.entrySection.value;
    const notesModel = this.notesSection.value;
    const stockModel = this.stockSection.value;
    const symbolModel = this.symbolSection.value;
    let dailytickeredit: optionstrade = new optionstrade();

    dailytickeredit.id = this.appService.getNewDocId();//this.isNewOptionsTrade ? this.appService.getNewDocId() : this.ticker.id;
    dailytickeredit.symbol = symbolModel.symbol;
    dailytickeredit.broadcastTrade = this.broadcastTrade.value;
    dailytickeredit.spread = formModel.spread;
    dailytickeredit.type = formModel.type;
    dailytickeredit.currentStockPrice = stockModel.currentStockPrice;
    dailytickeredit.aboveResistance = stockModel.aboveResistance;
    dailytickeredit.belowResistance = stockModel.belowResistance;
    dailytickeredit.stopLoss = stockModel.stopLoss;

    dailytickeredit.support = stockModel.support;
    dailytickeredit.postedby = symbolModel.postedBy;
    dailytickeredit.postedFor = symbolModel.postedFor;
    dailytickeredit.createdon = new Date(now_utc);// this.isNewOptionsTrade ? new Date(now_utc) : this.ticker.createdon;
    dailytickeredit.createdby = this.authService.currentUser.uid; // this.isNewOptionsTrade ? this.authService.currentUser.uid : this.ticker.createdby;
    dailytickeredit.isactive = true;
    dailytickeredit.isoptionactive = this.TRANS_ELEMENT_DATA.length > 0 ? true : false;
    dailytickeredit.isstockactive = this.currentStockPrice.value.length > 0 ? true : false;
    dailytickeredit.optionsellprice = "";
    dailytickeredit.optionexitdate = null;
    dailytickeredit.stocksellprice = "";
    dailytickeredit.stockexitdate = null;
    dailytickeredit.stockoftheday = stockModel.stockoftheday;

    let optionstradenotesarray: optionstradenotes[] = [];
    if (this.TRANS_ELEMENT_DATA.length > 0 && notesModel.notes.length > 0) {
      let ooptionstradenotes: optionstradenotes = new optionstradenotes('NEW', notesModel.notes, new Date(now_utc), currentUserName, this.appService.getNewDocId());
      optionstradenotesarray.push(ooptionstradenotes);
    }
    dailytickeredit.notes = optionstradenotesarray;

    // stocknotes

    let stokenotesarray: optionstradenotes[] = [];
    if (stockModel.currentStockPrice.length > 0 && stockModel.stockComments.length > 0) {
      let stokenotes: optionstradenotes = new optionstradenotes('NEW', stockModel.stockComments, new Date(now_utc), currentUserName, this.appService.getNewDocId());
      stokenotesarray.push(stokenotes);
    }
    dailytickeredit.stocknotes = stokenotesarray;

    let optionstradetransarray: optionstradetrans[] = [];
    // if (this.type.value.length > 0 && this.strikeprice.value.length > 0 && this.transtype.value.length > 0 && this.expdate.value.length <= 0) {

    if (this.TRANS_ELEMENT_DATA.length > 0) {
      for (var i = 0; i < this.TRANS_ELEMENT_DATA.length; i++) {
        let ooptionstradetrans: optionstradetrans = new optionstradetrans(this.TRANS_ELEMENT_DATA[i].strikeprice,
          this.TRANS_ELEMENT_DATA[i].strikeprice2, this.TRANS_ELEMENT_DATA[i].premiumpaid, this.TRANS_ELEMENT_DATA[i].expdate,
          this.TRANS_ELEMENT_DATA[i].transtype, this.TRANS_ELEMENT_DATA[i].selllegexpdate);
        optionstradetransarray.push(ooptionstradetrans)
      }

      /*let ooptionstradetrans: optionstradetrans = new optionstradetrans(this.strikeprice.value,
        this.strikePrice2.value, this.premiumpaid.value, this.expdate.value,
        this.transtype.value, this.selllegexpdate.value);
      optionstradetransarray.push(ooptionstradetrans)*/
      dailytickeredit.trans = optionstradetransarray;

      //data for azure
      this.tradeData.FBRefId = dailytickeredit.id;

      this.tradeData.TOpstkTradeDatum = new TOpstkTradeDatum();
      this.tradeData.TOpstkTradeDatum.Symbol = dailytickeredit.symbol;
      this.tradeData.TOpstkTradeDatum.PostedBy = dailytickeredit.postedby;
      this.tradeData.TOpstkTradeDatum.PostedFor = dailytickeredit.postedFor;
      this.tradeData.TOpstkTradeDatum.BroadcastTrade = dailytickeredit.broadcastTrade ? true : false;
      this.tradeData.TOpstkTradeDatum.CreatedBy = this.currentContextUser.displayName;
      this.tradeData.TOpstkTradeDatum.CreatedOn = dailytickeredit.createdon;
      this.tradeData.TOpstkTradeDatum.FbrefId = dailytickeredit.id;

      this.tradeData.TOptionTradeDatum = new TOptionTradeDatum();
      this.tradeData.TOptionTradeDatum.OptionType = dailytickeredit.type;
      this.tradeData.TOptionTradeDatum.SpreadType = dailytickeredit.spread;
      if (optionstradetransarray.length > 0) {
        this.tradeData.TOptionTradeDatum.StrikePrice = Number(optionstradetransarray[0].strikeprice);
        this.tradeData.TOptionTradeDatum.StrikePrice2 = optionstradetransarray[0].strikeprice2 > 0 ? Number(optionstradetransarray[0].strikeprice2) : 0;
        this.tradeData.TOptionTradeDatum.ExpDate = optionstradetransarray[0].expdate ? optionstradetransarray[0].expdate : null;
        this.tradeData.TOptionTradeDatum.SellExpDate = optionstradetransarray[0].selllegexpdate ? optionstradetransarray[0].selllegexpdate : null;
        this.tradeData.TOptionTradeDatum.PremiumPaid = optionstradetransarray[0].premiumpaid > 0 ? Number(optionstradetransarray[0].premiumpaid) : 0;
        this.tradeData.TOptionTradeDatum.TransType = optionstradetransarray[0].transtype
      }
      this.tradeData.TOptionTradeDatum.IsOptionActive = dailytickeredit.isoptionactive;
      this.tradeData.TOptionTradeDatum.OptionSellPrice = dailytickeredit.optionsellprice.length > 0 ? Number(dailytickeredit.optionsellprice) : 0;
      this.tradeData.TOptionTradeDatum.OptionExitDate = dailytickeredit.optionexitdate ? dailytickeredit.optionexitdate : null;
      this.tradeData.TOptionTradeDatum.CreatedOn = dailytickeredit.createdon;
      this.tradeData.TOptionTradeDatum.CreatedBy = this.currentContextUser.displayName;
      this.tradeData.TOptionTradeNote = new TOptionTradeNote();

      if (optionstradenotesarray.length > 0) {
        this.tradeData.TOptionTradeNote.FBid = optionstradenotesarray[0].fbid;
        this.tradeData.TOptionTradeNote.NotesType = optionstradenotesarray[0].notestype;
        this.tradeData.TOptionTradeNote.NotesPostedBy = this.currentContextUser.displayName;
        this.tradeData.TOptionTradeNote.NotesValue = optionstradenotesarray[0].notesvalue;
        this.tradeData.TOptionTradeNote.CreatedOn = optionstradenotesarray[0].createdon;
      }
      else {
        this.tradeData.TOptionTradeNote.FBid = "";
        this.tradeData.TOptionTradeNote.NotesType = "";
        this.tradeData.TOptionTradeNote.NotesPostedBy = "";
        this.tradeData.TOptionTradeNote.NotesValue = "";
        this.tradeData.TOptionTradeNote.CreatedOn = null;

      }
      this.tradeData.TStockTradeDatum = new TStockTradeDatum();
      this.tradeData.TStockTradeDatum.StockOfTheDay = this.stockoftheday.value ? true : false;
      this.tradeData.TStockTradeDatum.CurrentStockPrice = dailytickeredit.currentStockPrice.length > 0 ? Number(dailytickeredit.currentStockPrice) : 0;
      this.tradeData.TStockTradeDatum.AboveResistance = dailytickeredit.aboveResistance;
      this.tradeData.TStockTradeDatum.BelowResistance = dailytickeredit.belowResistance;
      this.tradeData.TStockTradeDatum.StopLoss = dailytickeredit.stopLoss.length > 0 ? Number(dailytickeredit.stopLoss) : 0;
      this.tradeData.TStockTradeDatum.Support = dailytickeredit.support.length > 0 ? Number(dailytickeredit.support) : 0;
      this.tradeData.TStockTradeDatum.StockSellPrice = dailytickeredit.stocksellprice.length > 0 ? Number(dailytickeredit.stocksellprice) : 0;
      this.tradeData.TStockTradeDatum.StockExitDate = dailytickeredit.stockexitdate ? dailytickeredit.stockexitdate : null;
      this.tradeData.TStockTradeDatum.IsStockActive = dailytickeredit.isstockactive;
      this.tradeData.TStockTradeDatum.CreatedOn = dailytickeredit.createdon;
      this.tradeData.TStockTradeDatum.CreatedBy = this.currentContextUser.displayName;


      this.tradeData.TStockTradeNote = new TStockTradeNote();
      if (stokenotesarray.length > 0) {
        this.tradeData.TStockTradeNote.FBid = stokenotesarray[0].fbid;
        this.tradeData.TStockTradeNote.NotesType = stokenotesarray[0].notestype;
        this.tradeData.TStockTradeNote.NotesPostedBy = this.currentContextUser.displayName;
        this.tradeData.TStockTradeNote.NotesValue = stokenotesarray[0].notesvalue;
        this.tradeData.TStockTradeNote.CreatedOn = stokenotesarray[0].createdon;
      }
      else {
        this.tradeData.TStockTradeNote.FBid = "";
        this.tradeData.TStockTradeNote.NotesType = "";
        this.tradeData.TStockTradeNote.NotesPostedBy = "";
        this.tradeData.TStockTradeNote.NotesValue = "";
        this.tradeData.TStockTradeNote.CreatedOn = null;

      }


    }
    return dailytickeredit;
  }

  onOptionsSelected(value: string) {
    this.showCalander = false;
    this.showSpread = false;
    this.showSingle = false;
    this.showCovered = false;
    this.transDisplayedColumns = [];
    switch (value) {
      case 'DEBIT SPREAD':
      case 'CREDIT SPREAD':
        this.showSpread = true;
        this.transDisplayedColumns.push('strikeprice', 'strikeprice2', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'SINGLE':
        this.showSingle = true;
        this.transDisplayedColumns.push('strikeprice', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'COVERED CALLS':
        this.showCovered = true;
        this.transDisplayedColumns.push('strikeprice', 'strikeprice2', 'premiumpaid', 'transtype', 'expdate');
        break;
      case 'CALENDER':
        this.showCalander = true;
        this.transDisplayedColumns.push('strikeprice', 'premiumpaid', 'transtype', 'expdate', 'selllegexpdate');
        break;
    }

    if (value === 'DEBIT SPREAD' || value === 'CREDIT SPREAD') {
      this.showSpread = true;
    }
    console.log("the selected value is " + value);
  }

  private getBroadcastChannels(): channeldisplay[] {
    console.log(this.postedFor.value)
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
    switch (this.postedFor.value) {
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


  public cancel() {
    this.resetForm();
    //this.isEditMode = false;
    this.alertService.resetStickyMessage();
    //this.router.navigateByUrl('auth/admin/optionstrade');
    this.router.navigateByUrl('auth/trades');

  }


  private saveCompleted(data?: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.resetForm();
    this.onOptionsTradeSaved.next(this.ticker);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'One or more errors occured whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }
}
