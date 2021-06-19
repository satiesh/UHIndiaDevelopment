// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment as env } from '@environments/environment';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '@app/services';
import { OptionsTradeStoreActions, OptionsTradeStoreSelectors, RootStoreState } from '../../store';
import { optionstrade } from '@app/models';
import { AlertService, AccountService, fadeInOut, MessageSeverity, Utilities } from '@app/services';
@Component({
  selector: 'app-stockoftheday',
  templateUrl: './stockoftheday.component.html',
  styleUrls: ['./stockoftheday.component.scss']
})

export class StockOfTheDayComponent implements OnInit {

  // Subscription Store Variables
  stockofthedayloadingIndicator$: Observable<boolean>;
  isStockOfTheDayLoaded$: Observable<boolean>;
  selectStockOfTheTrade$: Observable<optionstrade[]>;
  stockOftheDaySource: any;
  // End Subscription Store Variables

  constructor(public appService: AppService,
    private store$: Store<RootStoreState.State>) { }
  ngOnInit(): void {
    this.stockofthedayloadingIndicator$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoading);
    this.isStockOfTheDayLoaded$ = this.store$.select(OptionsTradeStoreSelectors.selectOptionsTradesLoaded);
    this.isStockOfTheDayLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new OptionsTradeStoreActions.DailyStockTradeRequestAction());
      }
    });
    this.selectStockOfTheTrade$ = this.store$.select(OptionsTradeStoreSelectors.selectStockOfTheDayByDate());
    this.LoadData();
  }
  LoadData() {
    this.selectStockOfTheTrade$.subscribe((data: optionstrade[]) => {
      if (data) {
        this.stockOftheDaySource = data;
        console.log('Stock Of the day data' , this.stockOftheDaySource);
      }
    });
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
}
