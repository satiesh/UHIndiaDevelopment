// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Component, ViewChild } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RegisterControlComponent } from './register-control.component';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild(RegisterControlComponent, { static: true })
  registerControl: RegisterControlComponent;

  constructor(iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer, public authService: AuthService) {
    iconRegistry.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('assets/img/google.svg'));
    iconRegistry.addSvgIcon('facebook', sanitizer.bypassSecurityTrustResourceUrl('assets/img/facebook.svg'));
    iconRegistry.addSvgIcon('twitter', sanitizer.bypassSecurityTrustResourceUrl('assets/img/twitter.svg'));
    iconRegistry.addSvgIcon('microsoft', sanitizer.bypassSecurityTrustResourceUrl('assets/img/microsoft.svg'));

  }

}
