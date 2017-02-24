import { Component, OnInit } from '@angular/core';
import { Patient } from '../patients';
import { PatientsService } from '../patients.service';
@Component({
  template: `<patient-form></patient-form>`
})
export class PatientAddComponent implements OnInit {
  // Define properties first.
  patient = new Patient;

  // Methods section: The constructor comes first!
  constructor(private _patientService: PatientsService) { }

  ngOnInit(): void {
    console.log("Patient Add Initialized ...");
  }

  // TODO: Remove this when done
  get diagnostic() {
    return JSON.stringify(this.patient);
  }

}