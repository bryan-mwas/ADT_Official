import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient, Regimen } from '../patients';
import { PatientsService } from '../patients.service';
import { DispenseService } from './dispense.service';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DrugsTable } from './dispense';
import { ModalDirective } from "ng2-bootstrap";
import 'rxjs/add/operator/switchMap';

declare var $: any;

@Component({
  selector: 'app-dispense',
  templateUrl: './patient-dispense.component.html',
  styleUrls: ['./patient-dispense.component.css'],
  providers: [DatePipe]
})
export class PatientDispenseComponent implements OnInit, DoCheck {

  patient = new Patient();
  @ViewChild('lgModal') public lgModal: ModalDirective;

  public showChildModal(): void {
    this.lgModal.show();
  }

  public hideChildModal(): void {
    this.lgModal.hide();
  }
  // Datepicker properties
  date_options: Object = {
    dateFormat: 'mm/dd/yy',
    changeMonth: true,
    changeYear: true,
    minDate: new Date(),
    beforeShowDay: $.datepicker.noWeekends // Disables weekends in the calendar
  }

  setdate: Date;
  drug_regimen: any[];
  regimens: Regimen[];
  regimen: any;
  reason: any[];
  purpose: any[];
  non_adherence: any[];
  latest_visit: any;
  appointment: any;
  current_regimen: number;
  dispenseForm: FormGroup;
  index: number;
  dispense_history: any[];
  batch_details: any[] = [];
  dose_list: Object[];
  indications: Object[];
  is_greater: boolean = false;

  get rows(): FormArray {
    return <FormArray>this.dispenseForm.get('drugs');
  }

  get today() {
    let today = new Date();
    return this._datePipe.transform(today, 'y-MM-dd')
  }
  constructor(
    private _datePipe: DatePipe,
    private _route: ActivatedRoute,
    private _router: Router,
    private _patientService: PatientsService,
    private _dispenseService: DispenseService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Passing an id to a router
    this._route.params
      .switchMap((params: Params) => this._patientService.getPatient(+params['id']))
      .subscribe(patient => this.patient = patient);
    this._route.params
      .switchMap((params: Params) => this._patientService.getLatestAppointment(+params['id']))
      .subscribe(visit => {
        this.latest_visit = visit;
        if (visit) {
          if (visit[0] != null) {
            this.dispenseForm.patchValue({
              last_appointment: visit[0].appointment_date
            })
          }
        }
      });
    this._route.params
      .switchMap((params: Params) => this._patientService.getLatestVisit(+params['id']))
      .subscribe(appointment => {
        if (appointment) {
          if (appointment[0] != null) {
            this.dispenseForm.patchValue({
              current_regimen_id: appointment[0].current_regimen_id,
              previous_visit: appointment[0].visit_date,
              current_height: appointment[0].current_height,
              current_weight: appointment[0].current_weight
            })
          }
        }
      });
    this._route.params
      .switchMap((params: Params) => this._patientService.getPreviousVisits(+params['id']))
      .subscribe(a => this.dispense_history = a);
    this._dispenseService.getRegimens().subscribe(
      regimen => this.regimens = regimen,
      error => console.error(error)
    );
    this._dispenseService.getDoseList().subscribe(
      response => this.dose_list = response
    );
    this._dispenseService.getIndicationsList().subscribe(
      response => this.indications = response
    );
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
    this.dispenseForm = this.fb.group({
      dispense_point: ['', Validators.required],
      ccc_number: [{ value: this.patient.ccc_number, disabled: true }],
      patient_name: [{ value: this.patient.first_name, disabled: true }],
      purpose_id: [{ value: '', disabled: true }],
      visit_date: [this.today, Validators.required],
      appointment_date: ['', [Validators.required]],
      current_height: '',
      current_weight: ['', Validators.required],
      days_to: ['', Validators.required],
      current_regimen_id: ['', Validators.required],
      last_regimen_id: [{ value: '', disabled: true }],
      appointment_adherance: '',
      non_adherance_reason_id: '',
      change_reason_id: '',
      patient_id: '',
      previous_visit: [{ value: '', disabled: true }],
      last_appointment: [{ value: '', disabled: true }],
      facility_id: 1,
      appointment_id: 1,
      user_id: 1, // TODO: Remove
      drugs: this.fb.array([this.buildRow()]),
    });

    const regimenControl = this.dispenseForm.get('current_regimen_id');

    const drugsControl = this.dispenseForm.get('drugs');
    drugsControl.valueChanges.forEach(
      (value: string) => console.log(value)
    );

    regimenControl.valueChanges.subscribe(
      value => this.setRegimenDrugs(+[value])
    )
    let appointmentCtrl = this.dispenseForm.get('appointment_date');

    //
    this.dispenseForm.get('days_to').valueChanges.subscribe(value => {
      if (value == '') {
        this.dispenseForm.patchValue({ appointment_date: '' });
        appointmentCtrl.setValidators(Validators.required);
        appointmentCtrl.updateValueAndValidity();
      }
      else {
        if (Math.sign(value) == 1) {
          this.nextAppointment(value);
          appointmentCtrl.clearValidators();
          appointmentCtrl.updateValueAndValidity();
        }
        else {
          this.dispenseForm.get('appointment_date').setValidators(Validators.required);
          this.dispenseForm.get('appointment_date').updateValueAndValidity();
        }
      }
    });

    // 
    this.dispenseForm.get('dispense_point').valueChanges.subscribe(
      value => {
        if (value !== '') {
          this.dispenseForm.controls['purpose_id'].enable();
        }
        else {
          // Disable the selection of purpose and erase current selection if any
          this.dispenseForm.controls['purpose_id'].disable();
          this.dispenseForm.patchValue({
            purpose_id: null
          })
        }
      }
    )
    this.rows.valueChanges.subscribe(
      val => console.log(val)
    )
  }

  ngDoCheck() {
    let a = this.rows.controls;
    let count = 1;
    for (let b of a) {
      count++;
      b.get('drug_id').valueChanges.subscribe(
        a => console.log('aye ' + count)
      )
    }
    let appointmentCtrl = this.dispenseForm.get('appointment_date');
    // Checks if the patient info has been asynchronously loaded
    this.dispenseForm.patchValue({
      ccc_number: this.patient.ccc_number,
      patient_name: this.patient.first_name,
      patient_id: this.patient.id
    });
    // Trigger calculation of appointment adherance
    if (this.dispenseForm.get('last_appointment') && this.dispenseForm.get('previous_visit') && this.dispenseForm.get('visit_date')) {
      if (this.dispenseForm.get('last_appointment').value !== null && this.dispenseForm.get('previous_visit').value !== null && this.dispenseForm.get('visit_date') != null) {
        let appointment = new Date(this.dispenseForm.get('last_appointment').value);
        let visit = new Date(this.dispenseForm.get('previous_visit').value);
        let dispense = new Date(this.dispenseForm.get('visit_date').value);
        this.appointmentAdherenceCalculator(visit, appointment, dispense);
      }
    }
  }
  /**
   * Calculates the appointment adherence based on:
   * previous_visit, appointment_date
   */
  appointmentAdherenceCalculator(prev_visit_date, expected_date, dispense_date) {
    let prev_visit = prev_visit_date;
    let appointment = expected_date;
    let dispense = dispense_date;
    let timeDiffA = Math.floor(appointment.getTime() - prev_visit.getTime());
    let timeDiffB = Math.floor(dispense.getTime() - appointment.getTime());
    let diffDaysA = Math.floor(timeDiffA / (1000 * 3600 * 24));
    let diffDaysB = Math.floor(timeDiffB / (1000 * 3600 * 24));
    let percentage = ((diffDaysA - diffDaysB) / diffDaysA) * 100;
    if (percentage > 100) {
      percentage = 100;
      this.dispenseForm.patchValue({
        appointment_adherance: percentage.toFixed(2) + "%"
      })
    }
    else if (percentage < 0) {
      percentage = 0.1
      this.dispenseForm.patchValue({
        appointment_adherance: percentage.toFixed(2) + "%"
      })
    }
    else {
      this.dispenseForm.patchValue({
        appointment_adherance: percentage.toFixed(2) + "%"
      })
    }
  }

  setDispenseDate(val) {
    this.dispenseForm.patchValue({
      visit_date: val
    });
  }
  populateTestData(value: number): void {
    this.dispenseForm.patchValue({
      days_to: value,
    });
  }

  buildRow(): FormGroup {
    return this.fb.group({
      drug_id: '',
      unit: [{ value: '', disabled: true }],
      batch_number: '',
      expiry_date: [{ value: '', disabled: true }],
      dose_id: '',
      expected_pill_count: [{ value: '', disabled: true }],
      actual_pill_count: '',
      duration: '',
      quantity_out: ['', Validators.pattern('[0-9]+')],
      balance_before: [{ value: '', disabled: true }],
      indication_id: '',
      comment: '',
      missed_pill_count: ''
    });
  }

  addRow() {
    // Proper way to access the individual form control in a form array
    let dispenseControl = this.rows.get(`${this.rows.length - 1}.quantity_out`);
    let drugControl = this.rows.get(`${this.rows.length - 1}.drug_id`);
    if (drugControl.value == '') {
      this.errorAlert('You have to select a drug');
    }
    else {
      if (dispenseControl.value !== '') {
        this.rows.push(this.buildRow());
      }
      else {
        this.errorAlert('Quantity Dispensed cannot be empty');
      }
    }
  }

  removeRow(i: number) {
    if (i !== 0) {
      const control = <FormArray>this.dispenseForm.controls['drugs'];
      control.removeAt(i);
    }
    else {
      alert('You cannot delete the first row. Try restting the fields');
    }
  }
  /**
   * 
   */
  logArrayElements(element, index, array) {
    console.log('a[' + index + '] = ' + element);
  }
  setDrugs(drugs: DrugsTable[]) {
    const drugsFGs = drugs.map(drugs => this.fb.group(drugs));
    console.log(drugsFGs)
    const drugsFormArray = this.fb.array(drugsFGs);
    this.dispenseForm.setControl('drugs', drugsFormArray);
    const drugsControl = this.dispenseForm.get('drugs');
    console.log(this.rows.controls['drug_id'])
    // drugsControl.valueChanges.forEach(
    //   val => {
    //     val.forEach((item, index) => {
    //       // console.log(item);
    //       // console.log(index)
    //       this._dispenseService.getDrugDetails(item.drug_id).subscribe(
    //         val => {
    //           this.rows.controls[+[index]].patchValue({
    //             unit: val.unit,
    //             duration: val.duration,
    //             expected_pill_count: val.expected_pill_count
    //           })
    //           this.batch_details = val.batches;
    //         }
    //       );
    //     });
    //   }
    // );
  }
  /**
   * Get users input, add the number of days and
   * set date picker to use the current date
   * Refer to this article: 
   * http://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html#fbid=2-vGKw3DAdn
   */
  nextAppointment(val) {
    let date = new Date();
    let date_to_set = new Date(date.setTime(date.getTime() + Number(val) * 86400000)); // sets the next appointment based using milliseconds.
    // Set appointment date
    // First Check if it is a weekend
    let app_date = new Date(date_to_set);
    if (app_date.getDay() == 6 || app_date.getDay() == 0) {
      alert('That will be during the weekend. Please reschedule.');
    }
    else {
      this.setdate = date_to_set;
      let a = this._datePipe.transform(this.setdate, 'MM-dd-y'); // using angular's built in date pipe to format date object.
      this.dispenseForm.patchValue({
        appointment_date: a
      });
      this.dispenseForm.get('appointment_date').setValidators(Validators.required);
      this.dispenseForm.get('appointment_date').updateValueAndValidity();
    }
  }
  /**
   * Calculates the days to an appointment
   */
  dateDiff(todate) {
    let fromdate: any = new Date();
    let to: any = new Date(todate)
    var diff = to - fromdate;
    var divideBy = {
      w: 604800000,
      d: 86400000,
      h: 3600000,
      n: 60000,
      s: 1000
    };

    let ctrl = Math.floor((diff / divideBy['d']) + 1);
    // Activate the function that sets the days remaining field
    this.populateTestData(ctrl);
    this.dispenseForm.patchValue({
      appointment_date: todate
    });
    console.log(ctrl);
  }

  save() {
    this._dispenseService.saveDispenseDetails(this.dispenseForm.value).subscribe(
      () => { this.notification('dispensed') },
      error => console.log(error)
    )
  }
  /**
   * Display warning alerts
   * Quantity Dispensed Input
   */
  smartAlert(content: string, type: string, optional: number = null) {
    $.SmartMessageBox({
      title: `webADT Alert: ${content} `,
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "Yes") {
        if (type === 'delete_row' && optional) {
          this.removeRow(optional)
        }
        else if (type === 'reset') {
          this.dispenseForm.reset()
        }
      }
    });
  }
  notification(value: string) {
    $.smallBox({
      title: `You have successfully ${value} drugs to the patient`,
      content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
      color: "#296191",
      iconSmall: "fa fa-thumbs-up bounce animated",
      timeout: 4000
    });
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

  confirm() {
    confirm('Are you sure you would like to reset the fields');
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
   * Check Validation for an individual element at a particular row.
   */
  checkValidation(value: any, index: number) {
    if (this.rows.get(`${index}.quantity_out`).errors) {
      this.errorAlert('Negative values are not allowed.');
    }
    let stock = this.rows.get(`${index}.balance_before`);
    if (+[value] > +[stock.value]) {
      this.errorAlert('Qty dispensed cannot be more than stock on hand')
      this.is_greater = true;
    }
    else {
      this.is_greater = false;
    }
  }

  getIndividualAndBatch(id: number, index: number) {
    this._dispenseService.getDrugDetails(id).subscribe(
      val => {
        this.rows.controls[+[index]].patchValue({
          unit: val.unit,
          duration: val.duration,
          expected_pill_count: val.expected_pill_count
        })
        this.batch_details = val.batches;
      }
    );
  }
  /**
   * Populates batch information i.e expiry_date
   * @param value 
   * @param index 
   */
  getBatchDetails(value: any, index: number) {
    let individualBatch = this.batch_details.find(val => val.batch_number.toLowerCase() === value);
    this.rows.controls[+[index]].patchValue({
      expiry_date: individualBatch.expiry_date,
      quantity_out: individualBatch.quantity_out,
      balance_before: individualBatch.balance_before
    })
  }
  /**
   * 
   */
  getPurpose(value: any) {
    // returns details of the selected purpose
    let purpose_details = this.purpose.find(val => val.id == +[value]);
    if (purpose_details.name.toLowerCase() === 'routine refill') {
      // Populate the drugs in the details
      this._route.params
        .switchMap((params: Params) => this._patientService.getDrugsHistory(+params['id']))
        .map(
        drugs => {
          let modified_drugs: DrugsTable[] = [];
          for (let item of drugs) {
            // Appends properties to the array. Intended for the form array
            item['actual_pill_count'] = '';
            item['missed_pill_count'] = '';
            item['comment'] = '';
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
              // console.log(val.batches)
            }
          );
        });
          if (drugs.length !== 0) {
            this.setDrugs(drugs);
            // Disable the (unit, expected_pill_count, expiry_date and balance_before)
            let a = this.rows.controls;
            for (let b of a) {
              b.get('unit').disable();
              b.get('expiry_date').disable();
              b.get('expected_pill_count').disable();
              b.get('balance_before').disable();
            }
          }
          else {
            console.log(`There is no drug history`);
          }
        });
    }
  }
  /**
   * Trigger modal if actual pill count is more than expected pill count
   */
  checkPillCount(actual: number, index: number) {
    let exp_pill_count = this.rows.get(`${index}.expected_pill_count`);
    if (actual > +[exp_pill_count.value]) {
      this.showChildModal();
    }
  }
  /**
   * Trigger modal if missed pills is greater than one
   */
  checkMissedPills(missed_pill_count: number, index: number) {
    if (missed_pill_count > 0) {
      this.showChildModal();
    }
  }
}
