import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, Observable } from 'rxjs';

import { AppService, AuthService, Utilities } from '@app/services';
import { usersubscription, ServiceSubscription, subscriptions } from '@app/models';
import { Store, select } from '@ngrx/store';
import { RootStoreState, SubscriptionStoreActions, SubscriptionStoreSelectors } from '../../store';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})

export class SubscriptionComponent implements OnInit {
  private sort: MatSort;
  private paginator: MatPaginator;

  //@ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }


  setDataSourceAttributes() {
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns = ['Name', 'Price', 'actions'];
  selectedSubscription: Subscription;
  subscriptionId: string;
  subscriptionamount: string;
  subscriptionname: string;
  dataSource: MatTableDataSource<ServiceSubscription>;
  isSubscriptionSelected: boolean = false;
  userSubscription: usersubscription;
  loadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription[]>;
  @Input() includeFreeSubscription: boolean = false;
  @Input() currentSelectedId: string = '';

  constructor(private appService: AppService, private authService: AuthService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>) {
    this.dataSource = new MatTableDataSource<ServiceSubscription>();
  }
  async  ngOnInit() {
    this.loadingIndicator$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);
    this.selectSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionWithoutAlreadyPaid('SoPquyCYSl6LSIFcm8xY'));
    console.log(this.includeFreeSubscription);

    await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());
        this.selectSubscription$.subscribe(
          data => {
            if (!this.includeFreeSubscription) {
              if (this.currentSelectedId) {
                this.dataSource.data = data.filter(a => a.id != 'WNiJ2h1kpYD83EzTpdaM' && a.id != this.currentSelectedId);
              }
              else {
                this.dataSource.data = data.filter(a => a.id != 'WNiJ2h1kpYD83EzTpdaM');
              }
            }
            else {
              this.dataSource.data = data;
            }
          }
        );
      }
      else {
        this.selectSubscription$.subscribe(
          data => {
            if (!this.includeFreeSubscription) {
              if (this.currentSelectedId) {
                this.dataSource.data = data.filter(a => a.id != 'WNiJ2h1kpYD83EzTpdaM' && a.id != this.currentSelectedId);
              }
              else {
                this.dataSource.data = data.filter(a => a.id != 'WNiJ2h1kpYD83EzTpdaM');
              }
            }
            else {
              this.dataSource.data = data;
            }
          });
      }
    });
   
  }





  subscribe(element) {
    this.isSubscriptionSelected = true;
    this.subscriptionId = element.id;
    this.subscriptionamount = element.Price;
    this.subscriptionname = element.Name;

    console.log(element);
    console.log(this.subscriptionamount);


  }
  getnewuserSubscription() {
    var date = new Date();
    var renewalDate = Utilities.getRenewalDate(this.subscriptionname.toLowerCase().indexOf("monthly") === 0 ? "monthly" : "yearly");
    //console.log(renewalDate);
    let subscriptionsArray: subscriptions[] = [];
    subscriptionsArray.push(new subscriptions(this.subscriptionId, true,
      new Date(this.datePipe.transform(renewalDate, "MM/dd/yyyy")),
      new Date(this.datePipe.transform(date, "MM/dd/yyyy")), this.authService.currentUser.uid));
    let nusersubscription = new usersubscription();
    nusersubscription.subscriptions = subscriptionsArray;
    return nusersubscription;
  }
}
