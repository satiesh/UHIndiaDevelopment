// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild } from '@angular/core';

import { LoginControlComponent } from './login-control.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '@app/services';
import { Router } from '@angular/router';
import { environment as env } from '@environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild(LoginControlComponent, { static: true })
  loginControl: LoginControlComponent;

  constructor(iconRegistry: MatIconRegistry, private router: Router,
    sanitizer: DomSanitizer, public authService: AuthService) {
    iconRegistry.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('assets/img/google.svg'));
    iconRegistry.addSvgIcon('facebook', sanitizer.bypassSecurityTrustResourceUrl('assets/img/facebook.svg'));
    iconRegistry.addSvgIcon('twitter', sanitizer.bypassSecurityTrustResourceUrl('assets/img/twitter.svg'));
    iconRegistry.addSvgIcon('microsoft', sanitizer.bypassSecurityTrustResourceUrl('assets/img/microsoft.svg'));

  }
  // NavigationExtras = {
  //    isLoggedIn : true
  // }

  onGoToWebsite() {
    window.open(env.staticsiteurl);
  }
  NavigationExtras = {
    state: {
      loggedIn: true,
    }
  }

}
