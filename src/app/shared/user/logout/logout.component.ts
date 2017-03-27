import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../utils/notification.service';
import { AuthenticationService } from '../../../_auth/authentication.service';

declare var $: any;

@Component({
  selector: 'sa-logout',
  template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
        <span> <a routerlink="/auth/login" title="Sign Out" data-action="userLogout"
                  data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
          class="fa fa-sign-out"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService) { }

  showPopup(){
    this.notificationService.smartMessageBox({
      title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content : 'You can improve your security further after logging out by closing this opened browser',
      buttons : '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed === 'Yes') {
        this.authenticationService.logout();
        this.router.navigateByUrl('/auth/login');
      }
    });
  }

  ngOnInit() {

  }



}
