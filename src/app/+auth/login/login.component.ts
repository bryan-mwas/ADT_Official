import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../../_auth/user';

import { AuthenticationService } from '../../_auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = new User();
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
    this._authenticationService.login(this.model)
    .subscribe(result => {
        if (result === true) {
          // login successful
          this._router.navigateByUrl('/home');
        } else {
          // login failed
          this.error = 'Email or password is incorrect';
          alert('Email or password is incorrect');
          this.loading = false;
        }
      });
  }

}
