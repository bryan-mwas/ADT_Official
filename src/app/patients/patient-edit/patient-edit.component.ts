import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { PatientsService } from '../patients.service';
import { Patient } from '../patients';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { NgForm } from '@angular/forms';

@Component({
  template: `<patient-form [patientData]="patient"></patient-form>`
})
export class PatientEditComponent implements OnInit, OnDestroy {
  edit: boolean = true;
  //  The first index of the array will always have the parameter id,
  patient: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _patientService: PatientsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.patient.push(params['id'],'edit')}
    )
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }
}