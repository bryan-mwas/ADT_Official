import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Patient } from '../patients';
import { PatientsService } from '../patients.service';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, DoCheck {
  patients: any;
  binding: string;
  public currentPage: number = 1;
  ccc_no: string;
  patient_name: string;
  contact: string;
  regimen: string;
  status_binding: string = '';

  constructor(protected service: PatientsService) { }

  ngOnInit() {
    this.service.getPatients().subscribe(p => this.patients = p);
    console.log('I got: ' + this.patients)
  }

  ngDoCheck() {
    // this.totalItems = this.patients.length;
    // console.log(this.patients.data)
  }

  public setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  public pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    this.service.getPaginatedPatients(event.page).subscribe(p => this.patients = p); // TODO: Error handling
    console.log('Number items per page: ' + event.itemsPerPage);
  }

  disable(val) {
    this.service.disablePatient(val).subscribe(
      () => this.service.getPatients().subscribe(p => this.patients = p),
      (error) => { console.log("Error happened" + error) },
      () => { console.log("the subscription is completed") }
    );
    this.notification('disabled');
  }

  notification(value: string) {
    $.smallBox({
      title: `You have successfully ${value} the patient`,
      content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
      color: "#C46A69",
      icon: "fa fa-trash-o swing animated",
      timeout: 4000
    });
  }
}
