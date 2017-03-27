import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_auth/user.service';
import { LayoutService } from '../../layout/layout.service';

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  user: any;

  constructor(
    private userService: UserService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    // this.userService.getLoginInfo().subscribe(user => {
    //   this.user = user
    this.userService.getUsers().subscribe(user => {
      this.user = user.data;
    });

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle();
  }

}
