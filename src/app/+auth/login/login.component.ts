import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // year property gets the current year
  year: any  = new Date().getUTCFullYear();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(event){
    event.preventDefault();
    this.router.navigate(['/home'])
  }

}
