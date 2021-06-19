// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { OnInit, Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { fadeInOut, AlertService, AppTranslationService, AccountService, Utilities } from '../../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RootStoreState, CoursesStoreSelectors, SubscriptionStoreSelectors, SubscriptionStoreActions, CoursesStoreActions } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ServiceSubscription, Courses, userpaymentdisplay, userpayment } from '@app/models';
import { User } from '@app/models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-user-payments-list',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.scss'],
  animations: [fadeInOut]
})

export class UserPaymentComponent implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  

  @Input() user: User;
  ELEMENT_DATA: userpaymentdisplay[] = [];
  loadingIndicator$: Observable<boolean>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription[]>;
  selectSubscriptionById$: Observable<ServiceSubscription>;

  courseLoadingIndicator$: Observable<boolean>;
  isCourseLoaded$: Observable<boolean>;
  selectCourses$: Observable<Courses[]>;
  selectCourseById$: Observable<Courses>;


  displayedColumns = ['description', 'price', 'referenceId', 'transactionDate'];
  dataSource: MatTableDataSource<userpaymentdisplay>;

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {

    //Load Subscriptions
    this.loadingIndicator$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoading);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);
    this.selectSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptions);

    //Load the courses
    this.courseLoadingIndicator$ = this.store$.select(CoursesStoreSelectors.selectCoursesLoading);
    this.isCourseLoaded$ = this.store$.select(CoursesStoreSelectors.selectCoursesLoaded);
    this.selectCourses$ = this.store$.select(CoursesStoreSelectors.selectCourses);
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }


  async loadData() {
    this.ELEMENT_DATA = [];
    //Load subscriptions if not avaliable
    await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());
      }
    });
    //Load courses if not avaliable
    await this.isCourseLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CoursesStoreActions.CourseRequestAction());
      }
    });
    if (this.user && this.user.hasOwnProperty('userpayment')) {

      for (var i = 0; i < this.user["userpayment"].length; i++) {
        let description: string = '';
        let payment: userpayment = this.user["userpayment"][i];
        if (payment["itemType"] == 'course') {
          await this.isCourseLoaded$.subscribe((result: boolean) => {
            if (result) {
              this.selectCourseById$ = this.store$.select(CoursesStoreSelectors.selectCourseById(payment["itemReferenceId"].toString()));
              this.selectCourseById$.subscribe((coursedata: Courses) => {
                if (coursedata) {
                  description = coursedata.Name;
                  let paymentInfo: userpaymentdisplay = new userpaymentdisplay();
                  paymentInfo.description = description;
                  paymentInfo.price = payment["price"];
                  paymentInfo.referenceId = payment["referenceId"];
                  paymentInfo.transactionDate = payment["createdOn"];
                  this.ELEMENT_DATA.push(paymentInfo)
                }
              });
            }
          });
        }
        else if (payment["itemType"] == 'subscription') {
          await this.isSubscriptionLoaded$.subscribe((result: boolean) => {
            if (result) {
              this.selectSubscriptionById$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionById(payment["itemReferenceId"].toString()));
              this.selectSubscriptionById$.subscribe((data: ServiceSubscription) => {
                if (data) {
                  description = data.Name;
                  let paymentInfo: userpaymentdisplay = new userpaymentdisplay();
                  paymentInfo.description = description;
                  paymentInfo.price = payment["price"];
                  paymentInfo.referenceId = payment["referenceId"];
                  paymentInfo.transactionDate = payment["createdOn"];
                  this.ELEMENT_DATA.push(paymentInfo)
                }
              });
            }
          });
        }
      }
    }
    this.dataSource.data = this.ELEMENT_DATA;
    //console.log(ELEMENT_DATA);
  }
  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }

}

