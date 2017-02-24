import { Component, OnInit, Input, DoCheck, ViewChild, AfterViewChecked, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Sources } from '../facility';
import { FacilityService } from '../facility.service';

declare var $: any;

@Component({
  selector: 'app-facility-patient-sources',
  templateUrl: './facility-patient-sources.component.html',
  styleUrls: ['./facility-patient-sources.component.css']
})
export class FacilityPatientSourcesComponent implements OnInit {

  errorMessage: string;
  sourcesList: Sources[];
  source = new Sources();
  @Input() formType: string;
  jQuery: any;
  form: string;

  constructor(private _facilityService: FacilityService) { }

  editForm: NgForm;
  @ViewChild('editForm') currentForm: NgForm;

  ngOnInit() {
    this._facilityService.getSources().subscribe(data => this.sourcesList = data);
  }

  // Save

  onSave(): void {
    this._facilityService.addPatientSource(this.source).subscribe(
      () => this.onSaveComplete(),
      error => console.log(error)
    );
  }

  onSaveComplete() {
    console.log('Created a new patient source...');
    this.successNotification('created');
    jQuery("#newPatientSource").modal("hide");
    this._facilityService.getSources().subscribe(data => this.sourcesList = data);
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
    this._facilityService.updatePatientSource(val).subscribe(
      (response) => this.onUpdateComplete(response),
      // () => jQuery("#newPatientSource").modal("hide"),
      error => console.log(error),
      () => { console.log("the subscription is completed") }
    );
  }

  onUpdateComplete(val) {
    this.editForm.reset();
    this._facilityService.getSources().subscribe(data => this.sourcesList = data);
    this.successNotification('updated');
  }

  // Delete

  disable(val) {
    this._facilityService.disableSource(val).subscribe(
      () => this._facilityService.getSources().subscribe(data => this.sourcesList = data),
      (error) => { console.log("Error happened" + error) },
      () => this.disableNotification()
    );
  }

  // Notifications

  successNotification(value: string) {
    $.smallBox({
      title: `You have successfully ${value} the Patient Source`,
      content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
      color: "#296191",
      iconSmall: "fa fa-thumbs-up bounce animated",
      timeout: 4000
    });
  }

  disableNotification() {
    $.smallBox({
      title: "You have successfully disabled the Patient Source",
      // content: "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      color: "#C46A69",
      timeout: 4000,
      icon: "fa fa-trash-o swing animated",
      number: "2"
    });
  }
}
