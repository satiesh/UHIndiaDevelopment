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
import { User } from '@app/models/user';
import { coupons } from '../../../models';
import { CouponEditorComponent } from '../coupon-editor/coupon-editor.component';


@Component({
  selector: 'app-coupon-dialog',
  templateUrl: 'coupon-dialog.component.html',
  styleUrls: ['coupon-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class EditCouponDialogComponent implements AfterViewInit {
  //updateFromUserList: boolean;
  isEditMode: boolean;
  collect$: Observable<any>;
  get couponName(): any {
    return this.data.coupon ? { name: this.data.coupon.name} : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditCouponDialogComponent>,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: { coupon: coupons}, private store$: Store<RootStoreState.State>) {
  }
  @ViewChild(CouponEditorComponent, { static: true }) couponControl: CouponEditorComponent;


  ngAfterViewInit() {
    this.couponControl.couponSaved$.subscribe(role => this.dialogRef.close(role));
  }
  
  cancel(): void {
    this.dialogRef.close(null);
  }
}
