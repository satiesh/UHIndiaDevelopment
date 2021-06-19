import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../services';
import { Store, select } from '@ngrx/store';
import { RootStoreState, CurrentUsersStoreSelectors, CurrentUsersStoreActions } from '../../../../store';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  loadingIndicator$: Observable<boolean>;
  isCurrentUserLoaded$: Observable<boolean>;
  selectCurrentUser$: Observable<User[]>;
  selectedUser: User = new User();
  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.loadingIndicator$ = this.store$.pipe(select(CurrentUsersStoreSelectors.getCurrentUserLoading));
    this.isCurrentUserLoaded$ = this.store$.pipe(select(CurrentUsersStoreSelectors.getCurrentUserLoaded));
    this.selectCurrentUser$ = this.store$.pipe(select(CurrentUsersStoreSelectors.getCurrentUser));
    this.isCurrentUserLoaded$.subscribe((result: boolean) => {
      if (!result) {
        this.store$.dispatch(new CurrentUsersStoreActions.CurrentUsersRequestAction(this.authService.currentUser.uid));
      }
      else {
        this.selectCurrentUser$.subscribe(doc => {
          if (doc) {
            this.selectedUser = doc[0];

          }
        });
      }
    });
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}
