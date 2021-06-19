// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseEditorComponent } from '../course-editor/course-editor.component';
import { Courses } from '../../../models/courses';
import { DatePipe } from '@angular/common';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: 'course-detail-dialog.component.html',
  styleUrls: ['course-detail-dialog.component.scss']
})
export class CourseDetailDialogComponent implements AfterViewInit {

  @ViewChild(CourseEditorComponent, { static: true })
  editcourse: CourseEditorComponent;
  @ViewChild(MatHorizontalStepper)
  stepper: MatHorizontalStepper;

  @ViewChild(CourseEditorComponent, { static: true }) courseEditoeControl: CourseEditorComponent;
  get courseName(): any {
    return this.data.course ? { name: this.data.course.Name} : null;
  }


  constructor(
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<CourseDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Courses }) {
  }
  ngAfterViewInit() {
    //this.editcourse.userSaved$.subscribe(course => this.dialogRef.close(course));
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
