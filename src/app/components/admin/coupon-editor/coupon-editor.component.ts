// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, OnChanges, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { coupons, Courses, ServiceSubscription } from '@app/models';
import { Subject, Observable } from 'rxjs';
import {
  AlertService, AccountService, AuthService, Utilities, AppService, MessageSeverity
} from '@app/services';
import { Store } from '@ngrx/store';
import { RootStoreState, SubscriptionStoreSelectors, CoursesStoreSelectors, CoursesStoreActions, SubscriptionStoreActions } from '../../../store';
import { CouponStoreActions, CouponStoreSelectors } from '../../../store/coupon-data';
import { distinct } from 'rxjs/operators';



interface CouponTypes {
  name: string;
  value: string;
}

@Component({
  selector: 'app-coupon-editor',
  templateUrl: './coupon-editor.component.html',
  styleUrls: ['./coupon-editor.component.scss']
})

export class CouponEditorComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewCoupon = false;
  isNameGood: boolean = false;
  private onCouponSaved = new Subject<coupons>();
  @Input() coupon: coupons;
  @Input() isEditMode: boolean;

  couponForm: FormGroup;
  couponSaved$ = this.onCouponSaved.asObservable();
  isCouponsLoaded$: Observable<boolean>;

  isCourseLoaded$: Observable<boolean>;
  selectCourses$: Observable<Courses[]>;
  isSubscriptionLoaded$: Observable<boolean>;
  selectSubscription$: Observable<ServiceSubscription[]>;

  couponTypes: CouponTypes[] = [
    { name: 'PRECENTAGE', value: 'PER' },
    { name: 'DOLLOR', value: 'AMT' }
  ];



  get discounteditem() {
    return this.couponForm.get('discounteditem');
  }
  get expiresOn() {
    return this.couponForm.get('expiresOn');
  }
  get isactive() {
    return this.couponForm.get('isactive');
  }
  get name() {
    return this.couponForm.get('name');
  }
  get type() {
    return this.couponForm.get('type');
  }
  get value() {
    return this.couponForm.get('value');
  }

  get courses() {
    return this.couponForm.get('courses');
  }

  get subscriptions() {
    return this.couponForm.get('subscriptions');
  }


  get applyall() {
    return this.couponForm.get('applyall');
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) {

    this.buildForm();
  }

  private buildForm() {
    this.couponForm = this.formBuilder.group({
      expiresOn: ['', Validators.required],
      isactive: '',
      name: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
      courses: '',
      subscriptions: '',
      applyall: false
    });
  }

  ngOnInit() {
    this.isCourseLoaded$ = this.store$.select(CoursesStoreSelectors.selectCoursesLoaded);
    this.selectCourses$ = this.store$.select(CoursesStoreSelectors.selectCourses);
    this.isSubscriptionLoaded$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionsLoaded);
    this.selectSubscription$ = this.store$.select(SubscriptionStoreSelectors.selectSubscriptionWithoutAlreadyPaidAndFree());
    this.isCouponsLoaded$ = this.store$.select(CouponStoreSelectors.selectCouponsLoaded);
    this.checkMasterData();
  }

  checkMasterData() {
    this.isCourseLoaded$.subscribe(data => {
      if (!data) {
        this.store$.dispatch(new CoursesStoreActions.CourseRequestAction());
      }
    });
    this.isSubscriptionLoaded$.subscribe(data => {
      if (!data) {
        this.store$.dispatch(new SubscriptionStoreActions.SubscriptionRequestAction());
      }
    })
  }

  checkCouponExists(event) {
    this.alertService.resetStickyMessage();
    var couponcode = this.couponForm.controls['name'].value
    if (this.coupon.name != couponcode) {
      let getCouponValue = this.appService.calculateCoupon(couponcode);
      var query = getCouponValue.subscribe(data => {
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            let coupon = data[i];
            if (coupon["name"] == couponcode) {
              console.log(coupon["name"])
              this.isNameGood = false;
              this.alertService.showStickyMessage("ERROR", "Coupon code " + couponcode + " already exists. Please use a new name.", MessageSeverity.error)
              break;
            }
          }
        }
        else {
          this.isNameGood = true;
        }
      });
    }
    else {
      this.isNameGood = true;
    }
  }

  ngOnChanges() {
    if (this.coupon) {
      this.isNewCoupon = false;
      this.isNameGood = true;
    } else {
      this.isNewCoupon = true;
      this.isNameGood = true;
      this.coupon = null;
    }

    this.resetForm();
  }

  public resetForm(stopEditing = false) {

    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.coupon) {
      this.isNewCoupon = true;
      this.coupon = new coupons();
    }

    this.couponForm.reset({
      expiresOn: Utilities.checkDate(this.coupon.expiresOn) || '',
      isactive: this.coupon.isactive || '',
      name: this.coupon.name || '',
      type: this.coupon.type || '',
      value: this.coupon.value || '',
      applyall: this.coupon.discounteditem == "All" ? true : false,
      courses: this.coupon.discounteditem? this.coupon.discounteditem.split(',') || [] :[],
      subscriptions: this.coupon.discounteditem? this.coupon.discounteditem.split(',') || []:[]
    });
  }

  save() {

    if (!this.couponForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.checkCouponExists('');
    if (!this.isNameGood) {
      this.alertService.showValidationError();
      return;
    }

    const editedcoupon = this.getEditedCoupon();
    if (this.isNewCoupon) {
      this.store$.dispatch(new CouponStoreActions.AddCouponRequestAction(editedcoupon));
      this.isCouponsLoaded$.subscribe(result => {
        if (result) {
          this.alertService.showMessage("COUPON ADDED", "Succesfully added new coupon", MessageSeverity.success);
        }
      });

    }
    else {
      this.store$.dispatch(new CouponStoreActions.UpdateCouponRequestAction(editedcoupon));
      this.isCouponsLoaded$.subscribe(result => {
        if (result) {
          this.alertService.showMessage("COUPON UPDATE", "Succesfully updated new coupon", MessageSeverity.success);
        }
      });

    }

    this.onCouponSaved.next(this.coupon);

  }

  getEditedCoupon() {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const formModel = this.couponForm.value;
    let coupon: coupons = new coupons();
    coupon.id = this.isNewCoupon ? this.appService.getNewDocId() : this.coupon.id;
    coupon.expiresOn = new Date(formModel.expiresOn);
    coupon.isactive = formModel.isactive;
    coupon.name = formModel.name;
    coupon.type = formModel.type;
    coupon.value = formModel.value;
    if (formModel.applyall) {
      coupon.discounteditem = "All";
    }
    else {
      var disitem: string;
      if (formModel.courses) {
        disitem = formModel.courses.join
      }
      if (formModel.subscriptions) {
        if (disitem) {
          disitem = disitem + "," + formModel.subscriptions.join(',');
        }
        else {
          disitem = formModel.subscriptions.join(',');
        }
      }
      coupon.discounteditem = disitem ? disitem : 'All';
    }
    coupon.createdon = this.isNewCoupon ? new Date(now_utc) : this.coupon.createdon;
    coupon.createdby = this.isNewCoupon ? this.authService.currentUser.uid : this.coupon.createdby;
    return coupon;
  }

  ngOnDestroy(): void {

  }

}
