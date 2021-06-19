// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Courses } from '@app/models';
import { CourseEditorComponent } from '@app/components/learning/course-editor/course-editor.component';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.scss']
})


export class EditCourseDialogComponent implements AfterViewInit {

  @ViewChild(CourseEditorComponent, { static: true }) editCourse: CourseEditorComponent; RoleName: any;
  get courseName(): any { return this.data.course ? { name: this.data.course.Name } : null; }

  constructor(
    public dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Courses }) {
      this.RoleName = JSON.parse(sessionStorage.getItem('current_user')).roles[0];

  }

  ngAfterViewInit() {
    this.editCourse.courseSaved$.subscribe(course => this.dialogRef.close(course));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
