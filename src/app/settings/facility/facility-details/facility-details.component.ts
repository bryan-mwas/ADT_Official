import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Facility, Counties, Types, SubCounties } from '../facility';
import { FacilityService } from '../facility.service';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.css']
})

export class FacilityDetailsComponent implements OnInit {
  // edit: boolean = true;
  @Input() edit: boolean;
  facility = new Facility();
  errorMessage: string;
  // Update
  @ViewChild('facilityDetailForm') currentForm: NgForm;
  facilityDetailForm: NgForm;

  private countiesList: Observable<string[]>;
  private subcountiesList: Observable<string[]>;
  private facilityTypes: Observable<string[]>;
  private serviceTypes: Observable<IMultiSelectOption[]>;

  private mySettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true,
        dynamicTitleMaxItems: 3,
        maxHeight: '300px',
    };

    private myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',
    };

  constructor(private route: ActivatedRoute,
    private _router: Router,
    private _facilityService: FacilityService) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this._facilityService.getFacilityDetails(+params['id']))
      .subscribe(facility => this.facility = facility);

    this.countiesList = this._facilityService.getCounties();
    this.subcountiesList = this._facilityService.getSubcounties();
    this.facilityTypes = this._facilityService.getFacilityTypes();
    this.serviceTypes = this._facilityService.getServices();
  }

  getFacilityDetails(id: number) {
    this._facilityService.getFacilityDetails(id).subscribe(
      data => this.facility = data,
      error => this.errorMessage = <any>error);
  }
  get diagnostic() {
    return JSON.stringify(this.facility);
  }

  ngAfterViewChecked() {
        this.formChanged();
    }

  formChanged() {
      if (this.currentForm === this.facilityDetailForm) { return; }
      this.facilityDetailForm = this.currentForm;
      if (this.facilityDetailForm) {
          this.facilityDetailForm.valueChanges
              .subscribe(data => this.onValueChanged(data));
      }
  }

  onValueChanged(data?: any) {
        if (!this.facilityDetailForm) { return; }
        const form = this.facilityDetailForm.form;
        console.log(form);
    }

     onSubmit(): void {
       this._facilityService.updateFacility(this.facility).subscribe();
     }

}
