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
import { channel } from '@app/models';
import { CouponEditorComponent } from '../coupon-editor/coupon-editor.component';
import { ChannelEditorComponent } from '../channel-editor/channel-editor.component';


@Component({
  selector: 'app-channel-dialog',
  templateUrl: 'channel-dialog.component.html',
  styleUrls: ['channel-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditChannelDialogComponent implements AfterViewInit {
  isEditMode: boolean;
  collect$: Observable<any>;
  get channelName(): any {
    return this.data.channel ? { name: this.data.channel.name } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditChannelDialogComponent>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: { channel: channel }, private store$: Store<RootStoreState.State>) {
  }
  @ViewChild(ChannelEditorComponent, { static: true }) channelControl: ChannelEditorComponent;


  ngAfterViewInit() {
    this.channelControl.channelSaved$.subscribe(role => this.dialogRef.close(role));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
