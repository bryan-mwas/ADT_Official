import { Component, OnInit } from '@angular/core';
import { User } from '../_auth/user';
import { UserService } from '../_auth/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: User[] = [];

  constructor(private _userService: UserService) { }

  ngOnInit() {
    // get users from secure api end point
    this._userService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

}
