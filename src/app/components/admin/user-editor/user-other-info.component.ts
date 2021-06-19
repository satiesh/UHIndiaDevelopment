// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, Observable } from 'rxjs';

import {
  AlertService, MessageSeverity,
  AppTranslationService, AuthService, AppService, ValidationService, AccountService
} from '@app/services';

import { Roles, SixDigitData, investmenttypes, investorlevel, tradingtools, investorleveldisplay, investmenttypesdisplay } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, InvestmentTypesStoreSelectors, InvestmentTypesStoreActions, TradingToolsStoreSelectors, TradingToolsStoreActions } from '@app/store';
import { User } from '@app/models/user';
import { MatSelectChange } from '@angular/material/select';
import { FormatPhonePipe } from '@app/pipes/format.phone';
import { InvestorLevelStoreSelectors, InvestorLevelStoreActions } from '../../../store/investorlevel-data';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-user-other-info',
  templateUrl: './user-other-info.component.html',
  styleUrls: ['./user-other-info.component.scss']
})

export class UserOtherInfoComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('form', { static: true })
  private sort: MatSort;
  private paginator: MatPaginator;
  private itssort: MatSort;
  private itspaginator: MatPaginator;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set itsmatSort(itsms: MatSort) {
    this.itssort = itsms;
    this.setItsDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set itsmatPaginator(itsmp: MatPaginator) {
    this.itspaginator = itsmp;
    this.setItsDataSourceAttributes();
  }

  setItsDataSourceAttributes() {
    this.itsdataSource.paginator = this.itspaginator;
    this.itsdataSource.sort = this.itssort;
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  displayedColumns = ['Name', 'IsActive'];
  itsdisplayedColumns = ['Name', 'IsActive'];

  private form: NgForm;
  @Input() user: User;
  @Input() isEditMode = false;
  userOtherInfoForm: FormGroup;
  loadingIndicator: boolean;
  dataSource: MatTableDataSource<investorleveldisplay>;
  itsdataSource: MatTableDataSource<investmenttypesdisplay>;

  investorleveldisplayarray: investorleveldisplay[] = [];
  investmenttypesdisplayarray: investmenttypesdisplay[] = [];

  selectedinvestmentType: string[] = [];
  selectedinvestorlevel: string[] = [];
  selectedtradingtools: string[] = [];


  loadingIndicator$: Observable<boolean>;
  isInvestmentTypesLoaded$: Observable<boolean>;
  selectInvestmentTypes$: Observable<investmenttypes[]>;

  loadingInvestorLevelIndicator$: Observable<boolean>;
  isInvestorLevelLoaded$: Observable<boolean>;
  selectInvestorLevel$: Observable<investorlevel[]>;
  selectedLevel: investorleveldisplay;
  loadingTradingToolsIndicator$: Observable<boolean>;
  isTradingToolsLoaded$: Observable<boolean>;
  selectTradingTools$: Observable<tradingtools[]>;


  //get investmentType() {
  //  return this.userOtherInfoForm.get('investmentType');
  //}
  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private authService: AuthService,
    private accountService: AccountService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private store$: Store<RootStoreState.State>
  ) {
    this.buildForm();
    this.dataSource = new MatTableDataSource<investorleveldisplay>();
    this.itsdataSource = new MatTableDataSource<investmenttypesdisplay>();
  }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.pipe(select(InvestmentTypesStoreSelectors.getInvestmentTypesLoading));
    this.isInvestmentTypesLoaded$ = this.store$.pipe(select(InvestmentTypesStoreSelectors.getInvestmentTypesLoaded));
    this.selectInvestmentTypes$ = this.store$.pipe(select(InvestmentTypesStoreSelectors.getInvestmentTypes));

    this.loadingInvestorLevelIndicator$ = this.store$.pipe(select(InvestorLevelStoreSelectors.getInvestorLevelLoading));
    this.isInvestorLevelLoaded$ = this.store$.pipe(select(InvestorLevelStoreSelectors.getInvestorLevelLoaded));
    this.selectInvestorLevel$ = this.store$.pipe(select(InvestorLevelStoreSelectors.getInvestorLevel));

    this.loadingTradingToolsIndicator$ = this.store$.pipe(select(TradingToolsStoreSelectors.getTradingToolsLoading));
    this.isTradingToolsLoaded$ = this.store$.pipe(select(TradingToolsStoreSelectors.getTradingToolsLoaded));
    this.selectTradingTools$ = this.store$.pipe(select(TradingToolsStoreSelectors.getTradingTools));
    this.loadData();
  }

  async loadData() {

    await this.isInvestmentTypesLoaded$.subscribe((result: boolean) => {
      if (!result) { this.store$.dispatch(new InvestmentTypesStoreActions.InvestmentTypesRequestAction()); }
      else {
        this.selectInvestmentTypes$.subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            console.log(data);
            let invleveldisplay: investmenttypesdisplay = new investmenttypesdisplay(
              data[i].id, data[i].Name, this.getTypeIsActive(data[i].id)
            )
            this.investmenttypesdisplayarray.push(invleveldisplay);
          }
          this.itsdataSource.data = this.investmenttypesdisplayarray;

        });
      }


      if (this.user.userothervalues && this.user.userothervalues.investmentType) {
        var strArr = this.user.userothervalues.investmentType.split(',');
        for (var i = 0; i < strArr.length; i++) {
          this.selectedinvestmentType.push(strArr[i])
        }
      }
    });


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
      if (this.user.userothervalues && this.user.userothervalues.investorLevel) {
        var strArr = this.user.userothervalues.investorLevel.split(',');
        for (var i = 0; i < strArr.length; i++) {
          this.selectedinvestorlevel.push(strArr[i])
        }
      }
    });


    await this.isTradingToolsLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new TradingToolsStoreActions.ToolsTradingRequestAction());
        this.loadingTradingToolsIndicator$.subscribe(
          (loading: boolean) => {
            this.SetLoadingIndicator(loading)
          });
      }
      if (this.user.userothervalues && this.user.userothervalues.tradingTools) {
        var strArr = this.user.userothervalues.tradingTools.split(',');
        for (var i = 0; i < strArr.length; i++) {
          this.selectedtradingtools.push(strArr[i])
        }
      }
    });

  }
  selectedlevel(element) {
    console.log(element);
  }
  getTypeIsActive(id: string): boolean {
    var returnValue: boolean = false;
    if (this.user.userothervalues && this.user.userothervalues.investmentType) {
      var strArr = this.user.userothervalues.investmentType.split(',');
      if (strArr.filter(a => a == id).length > 0) {
        returnValue = true;
      }
    }
    return returnValue;
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

  private SetLoadingIndicator(loading: boolean) {
    if (loading) {
      this.loadingIndicator = loading;
    }
  }
  private buildForm() {
    this.userOtherInfoForm = this.formBuilder.group({
      investmentType: '',
      investorLevel: '',
      tradingtools: '',
      disclaimeraccepted: ''
    });
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    //if (!this.user) {
    //  this.isNewUser = true;
    //  this.user = new User();
    //}


    this.userOtherInfoForm.reset({
      investmentType: this.selectedinvestmentType || '',
      investorLevel: this.selectedinvestorlevel || '',
      tradingtools: this.selectedtradingtools || '',
      disclaimeraccepted: this.user.userdisclaimer.accepted || ''
    });
  }


  save() { }

  ngOnChanges() {

    this.resetForm();
  }

  ngOnDestroy() {
  }
}
