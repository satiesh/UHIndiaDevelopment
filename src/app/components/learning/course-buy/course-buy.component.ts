import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';

import { AlertService, MessageSeverity, Utilities, fadeInOut, AccountService } from '@app/services';
import { Courses, Permission } from '@app/models';
import { CourseDetailDialogComponent } from '@app/components/learning/course-detail-dialog/course-detail-dialog.component';

import { RootStoreState, CoursesStoreSelectors, CoursesStoreActions } from '@app/store';
import { Observable } from 'rxjs';
import { CoursePaymentComponent, EditCourseDialogComponent, RegisterCourseDialogComponent } from '@app/components';
import { EncrDecrService } from '@app/services/encrdecr.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-course-buy',
  templateUrl: './course-buy.component.html',
  styleUrls: ['./course-buy.component.scss'],
  animations: [fadeInOut]
})
export class CourseBuyComponent implements OnInit {

  @ViewChild(CoursePaymentComponent, { static: true })
  editCourse: CoursePaymentComponent;
  currentCourseId: any;
  loadingIndicator$: Observable<boolean>;
  isCourseLoaded$: Observable<boolean>;
  selectCourses$: Observable<Courses[]>;

  sourceCourses: Courses[];
  sourceCourse: Courses;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private encrdecrService: EncrDecrService,
    public route: ActivatedRoute,
    private store$: Store<RootStoreState.State>) {
      route.params.subscribe(params => {
        this.currentCourseId = params['data'];
    });
  }

  ngOnInit(): void {
    this.loadingIndicator$ = this.store$.select(CoursesStoreSelectors.selectCoursesLoading);
    this.isCourseLoaded$ = this.store$.select(CoursesStoreSelectors.selectCoursesLoaded);
    this.selectCourses$ = this.store$.select(CoursesStoreSelectors.selectCourses);
    this.loadData();
  }
  
  checkDate(dateData: any) {
    return Utilities.checkDate(dateData);
  }
  async loadData() {
    await this.isCourseLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CoursesStoreActions.CourseRequestAction());
      }
      else {
        this.selectCourses$.subscribe(
          courses => this.onDataLoadSuccessful(courses),
          error => this.onDataLoadFailed(error)
        );
      }
    });
  }
  reloadCourse() {
    this.store$.dispatch(new CoursesStoreActions.CourseRequestAction());
  }
  private onDataLoadSuccessful(courses: Courses[]) {
    this.sourceCourses = courses.filter((element) => {
      return element.id === this.currentCourseId;
    });
    this.alertService.stopLoadingMessage();
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

  public viewdetails(course?: Courses) {
    this.sourceCourse = course;
    const dialogRef = this.dialog.open(CourseDetailDialogComponent,
      {
        width: '92vw',
        maxWidth: '92vw',
        disableClose: true,
        data: {course}
      });
    dialogRef.afterClosed().subscribe(u => {
      if (u) {
        //this.updateUsers(u);
      }
    });
  }


  get canViewCourses() {
    return this.accountService.userHasPermission(Permission.viewCoursesPermission);
  }
  get canManageCourses() {
    return this.accountService.userHasPermission(Permission.manageCoursesPermission);
  }

}
