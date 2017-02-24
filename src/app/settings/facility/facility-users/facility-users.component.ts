import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router, ActivatedRoute, Params } from '@angular/router';
import { User, Facility, AccessLevel } from '../facility';
import { FacilityService } from '../facility.service';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-facility-users',
  templateUrl: './facility-users.component.html',
  styleUrls: ['./facility-users.component.css']
})
export class FacilityUsersComponent implements OnInit {

  usersList: User[];
  user = new User();
  jQuery: any;
  private accessLevelList: Observable<String[]>;
  private facilityTypes: Observable<String[]>;
  private facilityDetails: Observable<String[]>

  editForm: NgForm;
  @ViewChild('editForm') currentForm: NgForm;

  constructor(private _facilityService: FacilityService) { }

  ngOnInit(): void {
    this._facilityService.getFacilityUsers().subscribe(data => this.usersList = data);

    this.accessLevelList = this._facilityService.getAccessLevels();
    this.facilityTypes = this._facilityService.getFacilityTypes();
    this.facilityDetails = this._facilityService.getFacilityDetails(this.user.facility_id);
  }

  // Add

  onSubmit(): void {
    this._facilityService.addFacilityUser(this.user).subscribe(
      () => this.onSaveComplete(),
      error => console.log(error)
    );
  }

  onSaveComplete() {
    console.log('Created a new user...');
    this.successNotification('created');
    jQuery("#newUser").modal("hide");
    this._facilityService.getFacilityUsers().subscribe(data => this.usersList = data);
  }

  // Update

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.editForm) { return; }
    this.editForm = this.currentForm;
    if (this.editForm) {
      this.editForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.editForm) { return; }
    const form = this.editForm.form;
    console.log(form);
  }

  onUpdate(val): void {
    this._facilityService.updateFacilityUser(val).subscribe(
      (response) => this.onUpdateComplete(response),
      error => console.log(error),
      () => { console.log("the subscription is completed") }
    );
  }

  onUpdateComplete(val) {
    this.editForm.reset();
    this._facilityService.getFacilityUsers().subscribe(data => this.usersList = data);
    this.successNotification('updated');
  }



  // Delete
  disable(val) {
    this._facilityService.disableUser(val).subscribe(
      () => this._facilityService.getFacilityUsers().subscribe(data => this.usersList = data),
      (error) => { console.log("Error happened" + error) },
      () => this.disableNotification()
    );
  }

  // Notifications

  successNotification(value: string) {
    $.smallBox({
      title: `You have successfully ${value} the User`,
      content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
      color: "#296191",
      iconSmall: "fa fa-thumbs-up bounce animated",
      timeout: 4000
    });
  }

  disableNotification(){
    $.smallBox({
      title: "You have successfully disabled the User",
      // content: "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      color: "#C46A69",
      timeout: 4000,
      icon: "fa fa-trash-o swing animated",
      number: "2"
    });    
  }

  get diagnostic() {
    return JSON.stringify(this.usersList);
  }

}
