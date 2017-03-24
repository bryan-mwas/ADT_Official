import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../_auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';
  // year property gets the current year
  year: any = new Date().getUTCFullYear();

  constructor(private _router: Router,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    // reset login status
    this._authenticationService.logout();
  }

  login() {
    alert('ehh');
    this.loading = true;
    this._authenticationService.login(this.model.email, this.model.password)
      .subscribe(result => {
        if (result === true) {
          // login successful
          this._router.navigate(['/home']);
        } else {
          // login failed
          this.error = 'Email or password is incorrect';
          this.loading = false;
        }
      });
  }

}
