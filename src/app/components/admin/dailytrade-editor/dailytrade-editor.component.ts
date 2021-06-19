// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, Observable } from 'rxjs';

import {
  AccountService, AlertService,
  MessageSeverity, AppTranslationService, AuthService, AppService, Utilities
} from '@app/services';

import { dailyticker, channel, channeldisplay } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, DailyTradeStoreActions, ChannelStoreSelectors, ChannelStoreActions, DailyTradeStoreSelectors } from '@app/store';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DailyTickerSuccessAction } from '../../../store/dailytrade-data/dailytrade-data.action';
import { MatTableDataSource } from '@angular/material/table';
import { broadcastinfo } from '../../../models/broadcastinfo';
import * as moment from 'moment';

@Component({
  selector: 'app-dailytrade-editor',
  templateUrl: './dailytrade-editor.component.html',
  styleUrls: ['./dailytrade-editor.component.scss']
})
export class DailyTradeEditorComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('form', { static: true })
  private form: NgForm;
  ELEMENT_DATA: channeldisplay[] = [];

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

  isNewDailyTrade = false;
  public isSaving = false;
  private onDailyTradeSaved = new Subject<dailyticker>();
  formattedAmount;
  @Input() ticker: dailyticker = new dailyticker();
  @Input() isEditMode = false;

  loadingIndicator: boolean;
  loadingChannelIndicator$: Observable<boolean>;
  isChannelLoaded$: Observable<boolean>;
  selectChannel$: Observable<channel[]>;
  isDailyTradeLoaded$: Observable<boolean>;

  tickerForm: FormGroup;
  tickerSaved$ = this.onDailyTradeSaved.asObservable();//this.store$.pipe(select(SubscriptionStoreSelectors.getSubscriptionLoaded));//this.onSubscriptionSaved.asObservable();

  get marketcap() {
    return this.tickerForm.get('marketcap');
  }

  get notes() {
    return this.tickerForm.get('notes');
  }

  get quote() {
    return this.tickerForm.get('quote');
  }

  get resistancetarget() {
    return this.tickerForm.get('resistancetarget');
  }

  get sector() {
    return this.tickerForm.get('sector');
  }
  get stoploss() {
    return this.tickerForm.get('stoploss');
  }
  get support() {
    return this.tickerForm.get('support');
  }
  get symbol() {
    return this.tickerForm.get('symbol');
  }
  get tradingpricerange() {
    return this.tickerForm.get('tradingpricerange');
  }
  get type() {
    return this.tickerForm.get('type');
  }
  get volume() {
    return this.tickerForm.get('volume');
  }
  get isactive() {
    return this.tickerForm.get('isactive');
  }
  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private store$: Store<RootStoreState.State>
  ) {
    this.dataSource = new MatTableDataSource();
    this.loadingChannelIndicator$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoading);
    this.isChannelLoaded$ = this.store$.select(ChannelStoreSelectors.selectChannelsLoaded);
    this.selectChannel$ = this.store$.select(ChannelStoreSelectors.selectChannels);

    this.loadData();
    this.buildForm();
  }
  ngOnInit() {


  }
  async loadData() {

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
    if (this.ticker) {
      this.isNewDailyTrade = false;
    } else {
      this.isNewDailyTrade = true;
      this.ticker = new dailyticker();
    }

    this.resetForm();
  }

  ngOnDestroy() {
  }

  public setUser(ticker?: dailyticker) {
    this.ticker = ticker;
    this.ngOnChanges();
  }

  private buildForm() {
    var pattern = /^([0-9]+(.[0-9]+)*,*)+$/;
    this.tickerForm = this.formBuilder.group({
      marketcap: '',
      notes: '',
      quote: '',
      resistancetarget: ['', [Validators.required, Validators.pattern(pattern)]],
      sector: '',
      stoploss: ['', [Validators.required, Validators.pattern(pattern)]],
      support: ['', [Validators.required, Validators.pattern(pattern)]],
      symbol: ['', Validators.required],
      tradingpricerange: '',
      type: '',
      volume: '',
      isactive:true
    });
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.ticker) {
      this.isNewDailyTrade = true;
      this.ticker = new dailyticker();
      this.ticker.isactive = true;
    }

    this.tickerForm.reset({
      marketcap: this.ticker.marketcap || '',
      notes: this.ticker.notes || '',
      quote: this.ticker.quote || '',
      resistancetarget: this.ticker.resistancetarget || '',
      sector: this.ticker.sector || '',
      stoploss: this.ticker.stoploss || '',
      support: this.ticker.support || '',
      symbol: this.ticker.symbol || '',
      tradingpricerange: this.ticker.tradingpricerange || '',
      type: this.ticker.type || '',
      volume: this.ticker.volume || '',
      isactive: this.ticker.isactive || false
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

    if (!this.tickerForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const editedTicker = this.getEditedTicker();
    var html = this.getBroadcastMessage(editedTicker);
    const broadcastlist = this.getBroadcastChannels();
    let obroadcastinfo: broadcastinfo = new broadcastinfo(html, broadcastlist);

    if (this.isNewDailyTrade) {
      this.store$.dispatch(new DailyTradeStoreActions.AddDailyTickerRequestAction({ dailyticker: editedTicker, channeldisplay: obroadcastinfo }))
      if (obroadcastinfo.channel.length > 0) {
        this.isDailyTradeLoaded$ = this.store$.select(DailyTradeStoreSelectors.selectDailyTradesLoaded);
        this.isDailyTradeLoaded$.subscribe(result => {
          if (result) {
            this.appService.sendTelegramMessage(obroadcastinfo).subscribe(
              data => { console.log(data)},
              error => this.alertService.showMessage("Error Sending Broadcast Message."));
          }
        }
        )
      }
    }
    else {
      this.store$.dispatch(new DailyTradeStoreActions.UpdateDailyTickerRequestAction({ dailyticker: editedTicker, channeldisplay: obroadcastinfo }))
      if (obroadcastinfo.channel.length > 0) {
        this.isDailyTradeLoaded$ = this.store$.select(DailyTradeStoreSelectors.selectDailyTradesLoaded);
        this.isDailyTradeLoaded$.subscribe(result => {
          if (result) {
            this.appService.sendTelegramMessage(obroadcastinfo).subscribe(
              data => { console.log(data) },
              error => this.alertService.showMessage("Error Sending Broadcast Message."));
          }
        }
        )
      }
    }
    this.onDailyTradeSaved.next(this.ticker);
    this.alertService.stopLoadingMessage();
  }
  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }
  private getBroadcastMessage(editedTicker: dailyticker) {
    var html = `<b>Updated ${moment(this.checkDate(editedTicker.createdon).toDateString()).format("MM/DD/YYYY")}</b>
<b>Alerts – UFA Swing Trade</b>
<b>Ticker :</b>${editedTicker.symbol}
<b>Sector :</b>${editedTicker.sector}
<b>Market cap :</b>${editedTicker.marketcap}
<b>Volume :</b>${editedTicker.volume}
<b>Trading price range :</b>${editedTicker.tradingpricerange}
<b>Quote :</b>${editedTicker.quote}
<b>Type :</b>${editedTicker.type}
<b>Resistance/Target :</b>${editedTicker.resistancetarget}
<b>Stop Loss :</b>${editedTicker.stoploss}
--------------- General Guidance ----------------
${editedTicker.notes}`;
    return html;
  }

  private getEditedTicker(): dailyticker {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const formModel = this.tickerForm.value;
    let dailytickeredit: dailyticker = new dailyticker();
    dailytickeredit.id = this.isNewDailyTrade ? this.appService.getNewDocId() : this.ticker.id,
      dailytickeredit.marketcap = formModel.marketcap,
      dailytickeredit.notes = formModel.notes,
      dailytickeredit.quote = formModel.quote,
      dailytickeredit.resistancetarget = formModel.resistancetarget,
      dailytickeredit.sector = formModel.sector,
      dailytickeredit.stoploss = formModel.stoploss,
      dailytickeredit.support = formModel.support,
      dailytickeredit.symbol = formModel.symbol,
      dailytickeredit.tradingpricerange = formModel.tradingpricerange,
      dailytickeredit.type = formModel.type,
      dailytickeredit.volume = formModel.volume,
      dailytickeredit.isactive = formModel.isactive,
      dailytickeredit.createdon = this.isNewDailyTrade ? new Date(now_utc) : this.ticker.createdon,
      dailytickeredit.createdby = this.isNewDailyTrade ? this.authService.currentUser.uid : this.ticker.createdby
    return dailytickeredit;
  }

  private getBroadcastChannels(): channeldisplay[] {
    let ochanneldisplay: channeldisplay[] = [];
    this.dataSource.data.forEach((channel: channeldisplay) => {
      if (channel.selected) {
        ochanneldisplay.push(channel);
      }
    });
    return ochanneldisplay;
  }
  public cancel() {
    this.resetForm();
    this.isEditMode = false;

    this.alertService.resetStickyMessage();
  }


  private saveCompleted(ticker?: dailyticker) {
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

  //private raiseEventIfRolesModified(currentUser: User, editedUser: User) {
  //  const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) === -1);
  //  const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) === -1);

  //  const modifiedRoles = rolesAdded.concat(rolesRemoved);

  //  if (modifiedRoles.length) {
  //    setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
  //  }
  //}



}
