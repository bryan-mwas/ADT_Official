import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../patients.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DispenseService } from '../dispense.service';
import { DrugsTable } from '../dispense';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';

declare var $: any;

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
  batch_details: any[] = [];
  regimens: Object[];
  drug_regimen: Object[];
  is_greater: boolean = false;

  get rows(): FormArray {
    return <FormArray>this.dispenseEditForm.get('drugs');
  }
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
      expiry_date: '',
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
          patient_name: `${patient.first_name} ${patient.other_name} ${patient.last_name}`
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
              visit_date: appointment[0].visit_date,
              current_regimen_id: appointment[0].current_regimen_id,
              last_regimen_id: appointment[0].current_regimen_id,
              appointment_adherence: appointment[0].appointment_adherence,
              current_height: appointment[0].current_height,
              current_weight: appointment[0].current_weight,
              purpose_id: appointment[0].purpose_id
            })
          }
        }
      });
    this._dispenseService.getRegimens().subscribe(
      regimen => {
        this.regimens = regimen;
      },
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
      ccc_number: [{value:'', disabled: true}],
      patient_name: [{value:'', disabled: true}],
      visit_date: '',
      purpose_id: '',
      current_height: '',
      current_weight: '',
      last_regimen_id: '',
      current_regimen_id: '',
      appointment_adherence: '',
      adherence_reason: '',
      drugs: this.fb.array([this.buildRow()])
    });
    let regimenControl = this.dispenseEditForm.get('current_regimen_id');
    regimenControl.valueChanges.subscribe(
      value => this.setRegimenDrugs(+[value])
    )
    
    this._activeRoute.params
      .switchMap((params: Params) => this._patientService.getDrugsHistory(+params['id']))
      .map(
      drugs => {
        let modified_drugs: DrugsTable[] = [];
        for (let item of drugs) {
          // Appends properties to the array. Intended for the form array
          item['brand_id'] = '';
          // Removes unwanted property.
          delete item['expected_pill_count']; 
          modified_drugs.push(item);
        }
        return modified_drugs;
      }
      )
      .subscribe(drugs => {
        // Populate the drug details for the refill oly when there's exist a history
        console.log(drugs);
        drugs.forEach((item, index) => {
          // console.log(item);
          // console.log(index)
          // Gets respective drugs batch number
          this._dispenseService.getDrugDetails(item.drug_id).subscribe(
            val => {
              // this.batch_details.push(val.batches)
              this.batch_details[index] = val.batches;
              console.log(this.batch_details)
            }
          );
        });
        if (drugs.length !== 0) {
          this.setDrugs(drugs);
          // Disable the (unit, expected_pill_count, expiry_date and balance_before)
          let a = this.rows.controls;
          for (let b of a) {
            b.get('unit').disable();
            b.get('balance_before').disable();
          }
        }
        else {
          console.log(`There is no drug history`);
        }
      });
  }

  setDrugs(drugs: DrugsTable[]) {
    const drugsFGs = drugs.map(drugs => this.fb.group(drugs));
    console.log(drugsFGs)
    const drugsFormArray = this.fb.array(drugsFGs);
    this.dispenseEditForm.setControl('drugs', drugsFormArray);
    const drugsControl = this.dispenseEditForm.get('drugs');
    console.log(this.rows.controls['drug_id']);
  }

  /**
   * Sets the drugs for a respective regimen
   */
  setRegimenDrugs(regimen_id: number) {
    this._dispenseService.getRegimenDrugs(regimen_id).subscribe(
      drug => {
        this.drug_regimen = drug[drug.length - 1]
        console.log(drug[drug.length - 1])
      }
    )
  }
  /**
   * Generate batches based on the drug id
   * @param id 
   * @param index 
   */
  getIndividualAndBatch(id: number, index: number) {
    this._dispenseService.getDrugDetails(id).subscribe(
      val => {
        this.rows.controls[+[index]].patchValue({
          unit: val.unit,
          duration: val.duration,
          expected_pill_count: val.expected_pill_count
        })
        this.batch_details[index] = val.batches;
      }
    );
  }
  /**
   * Populates batch information i.e expiry_date
   * @param value 
   * @param index 
   */
  getBatchDetails(value: any, index: number) {
    console.log(value);
    let individualBatch = this.batch_details[index].find(val => val.batch_number.toLowerCase() === value.toLowerCase());
    this.rows.controls[+[index]].patchValue({
      quantity_out: individualBatch.quantity_out,
      balance_before: individualBatch.balance_before
    })
  }

  /**
   * Check Validation for an individual element at a particular row.
   */
  checkValidation(value: any, index: number) {
    if (this.rows.get(`${index}.quantity_out`).errors) {
      this.errorAlert('Negative values are not allowed.');
    }
    let stock = this.rows.get(`${index}.balance_before`);
    if (+[value] > +[stock.value]) {
      this.smartAlert('Qty dispensed cannot be more than stock on hand')
      this.is_greater = true;
    }
    else {
      this.is_greater = false;
    }
  }

   /**
   * Display warning alerts
   * Quantity Dispensed Input
   */
  smartAlert(content: string) {
    $.SmartMessageBox(
      {
        title: `WARNING: ${content}`
      }
    );
  }

  errorAlert(value: string) {
    $.smallBox({
      title: "Error Alert",
      content: value,
      color: "#C46A69",
      icon: "fa fa-warning shake animated",
      timeout: 6000
    });
  }

}
