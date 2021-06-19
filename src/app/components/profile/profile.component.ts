import { Component, OnInit, ViewEncapsulation,  AfterViewInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '../../store';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { AuthService } from '../../services';
import { DisclaimerDialogComponent } from '../disclaimer-dialog/disclaimer-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User>;

  constructor(private _formBuilder: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private store$: Store<RootStoreState.State>) {

  }

  ngOnInit(): void {
    this.loadingIndicator$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoading);
    this.isCurrentUserLoaded$ = this.store$.select(CurrentUsersStoreSelectors.selectIsCurrentUsersLoaded);
    this.selectCurrentUser$ = this.store$.select(CurrentUsersStoreSelectors.selectUserById(this.authService.currentUser.uid));
    
    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
    });
  }

}
