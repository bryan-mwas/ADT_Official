import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from '../patients';
import { PatientsService } from '../patients.service';
import 'rxjs/add/operator/switchMap';
import { PaginationInstance } from 'ng2-pagination';
declare var $: any;

@Component({
  selector: 'app-patient-view',
  templateUrl: 'patient-view.component.html'
})
export class PatientViewComponent implements OnInit, DoCheck {
  patient = new Patient();
  viral_load: any[];
  errorMessage: string;
  days_to: number;
  latest_viral_load;
  dispense_history;
  appointment_history;
  latest_visit;
  latest_bsa;
  start_bsa;
  //Pagination Controls
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };
  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };

  constructor(private route: ActivatedRoute,
    private _router: Router,
    private _patientService: PatientsService) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this._patientService.getPatient(+params['id']))
      .subscribe(patient => {
        this.patient = patient;
        if (patient.current_status_name) {
          if (patient.current_status_name !== 'active') {
            this.smartModEg3();
          }
        }
        if (patient.first_visit) {
          let a = patient.first_visit.current_weight;
          let b = patient.first_visit.current_height
          if (a && b) {
            this.start_bsa = Math.sqrt((a * b) / 3600);
          }
        }
      });
    this.route.params
      .switchMap((params: Params) => this._patientService.getLatestVisit(+params['id']))
      .subscribe(a => {
        let latest = a[a.length - 1]
        this.latest_visit = latest;
        if (typeof latest !== 'undefined' && latest.current_weight && latest.current_height) {
          this.latest_bsa = Math.sqrt((latest.current_height * latest.current_weight) / 3600);
        }
      });
    this.route.params
      .switchMap((params: Params) => this._patientService.getPreviousVisits(+params['id']))
      .subscribe(a => this.dispense_history = a);
    this.route.params
      .switchMap((params: Params) => this._patientService.getViralLoad(+params['id']))
      .subscribe(vload => {
        this.viral_load = vload;
        this.latest_viral_load = vload[vload.length - 1]
      });
    this.route.params
      .switchMap((params: Params) => this._patientService.getAppointments(+params['id']))
      .subscribe(appointment => this.appointment_history = appointment);
  }

  ngDoCheck() {
    if (this.patient.next_appointment_date) {
      this.dateDiff(this.patient.next_appointment_date);
    }
    console.log(this.latest_viral_load)
  }

  getPatient(id: number) {
    this._patientService.getPatient(id).subscribe(
      data => this.patient = data,
      error => this.errorMessage = <any>error);
  }

  smartModEg3() {
    $.SmartMessageBox({
      title: "Status Not Active",
      content: "Cannot Dispense to Patient",
      buttons: '[OK]'
    });
  }

  // TODO: Remove this when done
  get diagnostic() {
    return JSON.stringify(this.patient);
  }

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
    this.days_to = Math.floor((diff / divideBy['d']) + 1);
  }
  daysToAppointment(todate) {
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
    return Math.floor((diff / divideBy['d']) + 1);
  }
  getAge(value: any, optional: any = null): any {
    let dob: any = new Date(value);
    let today: any;
    if (optional !== null) {
      today = new Date(optional);
    }
    else {
      today = new Date();
    }
    let age_in_years: number;
    let age_in_months: number;

    age_in_years = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    var y1 = today.getFullYear();
    var y2 = dob.getFullYear();
    age_in_months = (today.getMonth() + y1 * 12) - (dob.getMonth() + y2 * 12);

    return age_in_years;
  }
}
