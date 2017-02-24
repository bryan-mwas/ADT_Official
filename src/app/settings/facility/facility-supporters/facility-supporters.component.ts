import { Component, OnInit, Input, DoCheck, ViewChild, AfterViewChecked, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Supporters } from '../facility';
import { FacilityService } from '../facility.service';

declare var $: any;

@Component({
  selector: 'app-facility-supporters',
  templateUrl: './facility-supporters.component.html',
  styleUrls: ['./facility-supporters.component.css']
})
export class FacilitySupportersComponent implements OnInit {

  errorMessage: string;
  supportersList: Supporters[];
  supporter = new Supporters();
  formType: string;
  jQuery: any;
  form: string;

  constructor(private _facilityService: FacilityService) { }

  supportersForm: NgForm;
  
  editForm: NgForm;
  @ViewChild('editForm') currentForm: NgForm;

  ngOnInit() {
    this._facilityService.getSupporters().subscribe(data => this.supportersList = data);
  }

  // Create New
  onSave(): void {
    this._facilityService.addSupporter(this.supporter).subscribe(
      () => this.onSaveComplete(),
      error => console.log(error)
    );
  }

  onSaveComplete() {
    console.log('Created a new supporter...');
    this.successNotification('created');
    jQuery("#newSupporter").modal("hide");
    this._facilityService.getSupporters().subscribe(data => this.supportersList = data);
  }

  // Update Existing
  onUpdate(val): void {
    this._facilityService.updateSupporter(val).subscribe(
      (response) => this.onUpdateComplete(response),
      error => console.log(error)
      // () => { console.log("the subscription is complete") }
    );
  }

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

  onUpdateComplete(val) {
    this.editForm.reset();
    this._facilityService.getSupporters().subscribe(data => this.supportersList = data);
    this.successNotification('updated');
  }
  
  // Delete
  disable(val) {
    this._facilityService.disableSupporter(val).subscribe(
      () => this._facilityService.getSupporters().subscribe(data => this.supportersList = data),
      (error) => { console.log("Error happened" + error) },
      () => this.disableNotification()
    );
  }

  successNotification(value: string) {
    $.smallBox({
      title: `You have successfully ${value} the Supporter`,
      content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
      color: "#296191",
      iconSmall: "fa fa-thumbs-up bounce animated",
      timeout: 4000
    });
  }

  disableNotification(){
    $.smallBox({
      title: "You have successfully disabled the Facility Supporter",
      // content: "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      color: "#C46A69",
      timeout: 4000,
      icon: "fa fa-trash-o swing animated",
      number: "2"
    });    
  }

  get diagnostic() {
    return JSON.stringify(this.supportersList);
  }


}
