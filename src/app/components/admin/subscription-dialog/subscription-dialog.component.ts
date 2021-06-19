// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================
import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ServiceSubscription } from '@app/models';
import { SubscriptionEditorComponent } from '../subscription-editor/subscription-editor.component';


@Component({
  selector: 'app-subscription-dialog',
  templateUrl: 'subscription-dialog.component.html',
  styleUrls: ['subscription-dialog.component.scss']
})
export class EditSubscriptionDialogComponent implements AfterViewInit {
  @ViewChild(SubscriptionEditorComponent, { static: true })
  editSubscription: SubscriptionEditorComponent;

  get subscriptionName(): any {
    return this.data.subscription ? { name: this.data.subscription.Name} : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subscription: ServiceSubscription}) {
  }

  ngAfterViewInit() {
    this.editSubscription.subscriptionSaved$.subscribe(subscription => this.dialogRef.close(subscription));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
