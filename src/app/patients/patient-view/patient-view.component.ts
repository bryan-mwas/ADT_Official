import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from '../patients';
import { PatientsService } from '../patients.service';
import 'rxjs/add/operator/switchMap';
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

  constructor(private route: ActivatedRoute,
    private _router: Router,
    private _patientService: PatientsService) {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this._patientService.getPatient(+params['id']))
      .subscribe(patient => {
        this.patient = patient;
        if(patient.current_status != null){
          if(patient.current_status[0]){
            if(patient.current_status[0].name !== 'active') {
              this.smartModEg3();
            }
          }
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
  }

  ngDoCheck() {
    if(this.patient.visit){
      this.dateDiff(this.patient.visit.appointment.appointment_date);
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
    get diagnostic () {
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

    getAge(value: any): any {
        let dob: any = new Date(value);
        let today: any = new Date();
        let age_in_years: number;
        let age_in_months: number;

        age_in_years = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
        var y1 = today.getFullYear();
        var y2 = dob.getFullYear();
        age_in_months = (today.getMonth() + y1 * 12) - (dob.getMonth() + y2 * 12);

        return age_in_years;
    }
}
