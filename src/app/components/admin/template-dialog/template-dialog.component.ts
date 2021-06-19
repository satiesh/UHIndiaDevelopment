// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { RootStoreState, RolesStoreSelectors, RolesStoreActions, PermissionsStoreSelectors, PermissionsStoreActions } from '@app/store';
import { Observable } from 'rxjs';
//import { User } from 'firebase';
import { AccountService } from '@app/services';
import { template } from '@app/models';
import { TemplateEditorComponent } from '../template-editor/template-editor.component';


@Component({
  selector: 'app-template-dialog',
  templateUrl: 'template-dialog.component.html',
  styleUrls: ['template-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditTemplateDialogComponent implements AfterViewInit {
  isEditMode: boolean;
  collect$: Observable<any>;
  get templateName(): any {
    return this.data.template ? { name: this.data.template.name } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditTemplateDialogComponent>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: { template: template }, private store$: Store<RootStoreState.State>) {
  }
  @ViewChild(TemplateEditorComponent, { static: true }) templateControl: TemplateEditorComponent;


  ngAfterViewInit() {
    this.templateControl.templateSaved$.subscribe(role => this.dialogRef.close(role));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
