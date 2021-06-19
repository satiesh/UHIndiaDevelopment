import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

}
