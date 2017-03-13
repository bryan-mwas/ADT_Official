import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../patients.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DispenseService } from '../dispense.service';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-dispense-edit',
  templateUrl: './dispense-edit.component.html',
  styleUrls: ['./dispense-edit.component.css']
})
export class DispenseEditComponent implements OnInit {
  // Class properties
  patient_visits: any;
  regimenDrugs: any;
  reason: any;
  non_adherence: any;
  purpose: any;
  dispenseEditForm: FormGroup;
  dispense_history: Object[];
  dose_list: Object[];
  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _patientService: PatientsService,
    private _dispenseService: DispenseService,
    protected fb: FormBuilder
  ) { }

  buildRow(): FormGroup {
    return this.fb.group({
      drug_id: '',
      unit: [{ value: '', disabled: true }],
      batch_number: '',
      expiry_date: [{ value: '', disabled: false }],
      dose_id: '',
      actual_pill_count: '',
      duration: '',
      quantity_out: ['', Validators.pattern('[0-9]+')],
      balance_before: [{ value: '', disabled: true }],
      brand_id: '',
      indication_id: '',
      comment: '',
      missed_pill_count: ''
    })
  }

  ngOnInit() {
    this._activeRoute.params
      .switchMap((params: Params) => this._patientService.getPatient(+params['id']))
      .subscribe(patient => {
        this.dispenseEditForm.patchValue({
          ccc_number: patient.ccc_number,
          patient_name: patient.first_name + patient.other_name + patient.last_name
        })
      });
    this._dispenseService.getDoseList().subscribe(
      response => this.dose_list = response
    );
    this._activeRoute.params.switchMap((params: Params) => this._patientService.getPreviousVisits(+params['id'])).subscribe(
      response => this.patient_visits = response
    );
    this._activeRoute.params
      .switchMap((params: Params) => this._patientService.getLatestVisit(+params['id']))
      .subscribe(appointment => {

        if (appointment) {
          if (appointment[0] != null) {
            this.dispenseEditForm.patchValue({
              latest_visit_date: appointment[0].visit_date,
              current_regimen_id: appointment[0].current_regimen_id,
              last_regimen_id: appointment[0].current_regimen_id,
              previous_visit: appointment[0].visit_date,
              appointment_adherence: appointment[0].appointment_adherence,
              current_height: appointment[0].current_height,
              current_weight: appointment[0].current_weight
            })
          }
        }
      });
    this._dispenseService.getRegimens().subscribe(
      regimen => this.regimenDrugs = regimen,
      error => console.error(error)
    )
    this._dispenseService.getChangeReason().subscribe(
      reason => this.reason = reason,
      error => console.error(error)
    );
    this._dispenseService.getNonAdherence().subscribe(
      reason => this.non_adherence = reason,
      error => console.error(error)
    );
    this._dispenseService.getPurpose().subscribe(
      p => this.purpose = p,
      error => console.error(error)
    );
    this._activeRoute.params
      .switchMap((params: Params) => this._patientService.getPreviousVisits(+params['id']))
      .subscribe(a => this.dispense_history = a);
    this.dispenseEditForm = this.fb.group({
      ccc_number: '',
      patient_name: '',
      visit_date: '',
      purpose_id: '',
      current_height: '',
      current_weight: '',
      last_regimen_id: '',
      current_regimen_id: '',
      appointment_adherence: '',
      adherence_reason: '',
      // drugs: this.fb.array([this.buildRow()])
      drug_id: '',
      unit: [{ value: '', disabled: true }],
      batch_number: '',
      expiry_date: [{ value: '', disabled: false }],
      dose_id: '',
      actual_pill_count: '',
      duration: '',
      quantity_out: ['', Validators.pattern('[0-9]+')],
      balance_before: [{ value: '', disabled: true }],
      brand_id: '',
      indication_id: '',
      comment: '',
      missed_pill_count: ''
    });
  }

}
