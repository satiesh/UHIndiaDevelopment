// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, AfterViewInit, Inject, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Courses } from '@app/models';
import { CoursePaymentComponent } from '../course-payment/course-payment.component';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-register-course-dialog',
  templateUrl: './register-course-dialog.component.html',
  styleUrls: ['./register-course-dialog.component.scss']
})


export class RegisterCourseDialogComponent implements AfterViewInit {
  @ViewChild(CoursePaymentComponent, { static: true })
  editCourse: CoursePaymentComponent;
  @Input() course: Courses = new Courses();
  get courseName(): any { return this.data.course ? { name: this.data.course.Name } : null; }

  constructor(
    public dialogRef: MatDialogRef<RegisterCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Courses }) {
      console.log('From Register' , data);
  }

  ngAfterViewInit() {
    //this.editCourse.courseSaved$.subscribe(user => this.dialogRef.close(user));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
