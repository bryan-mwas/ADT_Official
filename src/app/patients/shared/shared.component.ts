import { Component, OnInit, Input, DoCheck, OnChanges, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatientsService } from '../patients.service';
import { Patient, Service, Status, Regimen, Prophylaxis, Who_stage, Source, Illness, Allergies, FamilyPlanning, PlaceOfBirth } from '../patients';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Observable } from 'rxjs/Observable';
import { LayoutService } from '../../shared/layout/layout.service';
import 'rxjs/add/operator/takeWhile';

declare var $: any;

@Component({
    selector: 'patient-form',
    templateUrl: './shared-form.component.html',
    styles: [`
        .add {
            background-color: #80f26d !important;
        }
        .edit {
            background-color: #FF9 !important;
        }
    `],
    providers: [DatePipe]
})

// TODO: Handle error catching in all subscriptions

export class SharedComponent implements OnInit, DoCheck, OnChanges {

    formType: string;
    @Input() patientData: string[];
    patientForm: FormGroup;
    toggle_facilities: boolean = false;
    toggle_isoniazid_dates: boolean = false;
    toggle_prophylaxis_check: boolean = false;
    toggle_pep: boolean = false;
    toggle_prep: boolean = false;
    toggle_prep_result: boolean = false;
    toggle_oi: boolean = false;
    dispense: boolean = false;

    // Define properties first.
    patient: Patient;
    edit: boolean = false;
    add: boolean = true;
    source = new Source;
    service = new Service
    regimen = new Regimen;
    who_stage = new Who_stage;
    errorMessage: string;
    patientServices: Service[];
    patientSources: Source[];
    patientRegimen: Observable<Regimen[]>;
    patientWhostage: Observable<Who_stage[]>;
    familyPlanningOptions: IMultiSelectOption[];
    birth_place: Observable<PlaceOfBirth[]>;
    facilities: Observable<Object[]>;
    // Variables to multiselect controls
    family_planning_list: string[];
    chronic_illness_list: string[];
    allergies_list: string[];
    prophylaxis_list: number[] = [];
    status: Observable<any[]>;

    ccc_number_warning: string = null;
    spouse_match_alert: string = null;

    selectedOptions: string[]; // Default selection

    chronicIllnessOptions: IMultiSelectOption[];

    allergiesOptions: IMultiSelectOption[];
    prophylaxisOptions: IMultiSelectOption[];

    mySettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true,
        dynamicTitleMaxItems: 1,
        maxHeight: '300px',
    };

    myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',
    };

    // Methods section: The constructor comes first!
    constructor(
        private _datePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute,
        private _patientService: PatientsService,
        private fb: FormBuilder,
        private _layoutService: LayoutService
    ) { }


    ngOnInit(): void {
        this._layoutService.onCollapseMenu();   // Hide the sidebar
        this.patientWhostage = this._patientService.getWho_stage();
        this.status = this._patientService.getStatus();
        this.facilities = this._patientService.getFacilities();
        this.birth_place = this._patientService.getLocation();
        this._patientService.getFamilyPlan().subscribe(resp => this.familyPlanningOptions = resp);
        this._patientService.getIllness().subscribe(resp => this.chronicIllnessOptions = resp);
        this._patientService.getAllergies().subscribe(allergies => this.allergiesOptions = allergies);
        this._patientService.getProphylaxis().subscribe(prophy => this.prophylaxisOptions = prophy);
        this._patientService.getSource().subscribe(source => this.patientSources = source);
        this._patientService.getServices().subscribe(service => { this.patientServices = service });
        // Create the form
        this.patientForm = this.fb.group({
            id: [''],
            ccc_number: ['', Validators.required],
            first_name: ['', Validators.required],
            last_name: [''],
            other_name: [''],
            birth_date: ['', Validators.required],
            county_sub_id: [''],
            age_in_years: [{ value: '', disabled: true }],
            age_in_months: [{ value: '', disabled: true }],
            initial_weight: ['', Validators.required],
            initial_height: ['', Validators.required],
            current_height: [''],
            current_weight: '',
            initial_bsa: [''],
            current_bsa: [''],
            phone_number: ['07', [Validators.required]],
            physical_address: [''],
            gender: ['', Validators.required],
            is_pregnant: ['0'],
            is_tb: ['0'],
            is_tb_tested: ['0'],
            is_sms: ['0'],
            is_smoke: ['0'],
            is_alcohol: ['0'],
            status_id: ['1'], // defaults to active
            enrollment_date: [this.today(), Validators.required],
            regimen_start_date: [this.today(), Validators.required],
            initial_regimen_id: ['', Validators.required],
            current_regimen_id: [''],
            service_id: ['', Validators.required],
            facility_id: 1,
            supporter_id: 1,
            who_stage_id: [''],
            prophylaxis: [{ value: [], disabled: false }],
            source_id: [''],
            disclosure: ['0'],
            spouse_ccc: [''],
            status: 'no partner',
            family_planning: [{ value: [], disabled: false }],
            support_group: [''],
            alternate_number: [''],
            drug_name: [''],
            other_illness: [''],
            allergy_name: [''],
            illnesses: [{ value: [], disabled: false }],
            drug_id: [{ value: [], disabled: false }],
            tb_category: [''],
            tb_phase: [''],
            start_date: [''],
            end_date: [''],
            pep_reason: [''],
            isoniazid_start: [''],
            isoniazid_end: [''],
            is_support: '',
            is_illness: '',
            is_drugs: '',
            is_allergies: '',
            status_change: '',
            user_id: '1',
            appointment_date: '',
            days_to: [{ value: '', disabled: true }],
            ccc_notify: [{ value: '', disabled: true }],
            start_age: [{ value: '', disabled: true }],
            current_age: [{ value: '', disabled: true }],
            prep_reason: '',
            is_prep_tested: '0',
            prep_tested: '',
            prep_result: '0'
        });
        // Track prep result
        this.patientForm.get('prep_result').valueChanges
            .subscribe(
            value => {
                let art = this.patientServices.find(service => service.name.toLowerCase() === 'art');
                this.smartAlert('Patient should be started on ART Service');
                // If positive set service to ART
                if (value == 1) {
                    this.patientForm.patchValue({
                        service_id: art.id
                    })
                }
            });
        // Track pregnancy to trigger PMTCT if one is pregnant
        this.patientForm.get('is_pregnant').valueChanges
            .takeWhile(() => typeof this.patientSources !== 'undefined')
            .subscribe(
            is_pregnant => {
                if (+[is_pregnant] === 1) {
                    let pmtct = this.patientServices.find(service => service.name.toLowerCase() === 'pmtct');
                    if (typeof pmtct !== 'undefined') {
                        this.patientForm.patchValue({
                            service_id: pmtct.id
                        });
                    }
                }
            }
            )
        // Track source_id
        this.patientForm.get('source_id').valueChanges
            .takeWhile(() => typeof this.patientSources !== 'undefined')
            .subscribe(
            id => {
                // Get the source name based on the [id].
                if (typeof this.patientSources !== 'undefined') {
                    let individual_source = this.patientSources.find(source => source.id === +[id])
                    if (individual_source.name.toLowerCase() === 'transfer in') {
                        this.toggle_facilities = true;
                    }
                    else {
                        // TODO: Clear the selected value in the transfer from field
                        this.toggle_facilities = false;
                    }
                }
            });
        // Watch for changes to the service_id value. Triggers loading of regimens belonging to respective service
        this.patientForm.get('service_id').valueChanges
            .takeWhile(() => typeof this.patientSources !== 'undefined')
            .subscribe(service_id => {
                this.setService(service_id);
                let pep = this.patientServices.find(service => service.name.toLowerCase() === 'pep');
                let prep = this.patientServices.find(service => service.name.toLowerCase() === 'prep');
                let oi = this.patientServices.find(service => service.name.toLowerCase() === 'oi only');
                if (typeof pep !== 'undefined') {
                    if (pep.id === +[service_id]) {
                        this.toggle_pep = true;
                    }
                    else {
                        this.toggle_pep = false;
                    }
                }
                if (typeof prep !== 'undefined') {
                    if (prep.id === +[service_id]) {
                        this.toggle_prep = true;
                    }
                    else {
                        this.toggle_prep = false;
                    }
                }
                if (typeof oi !== 'undefined') {
                    if (oi.id === +[service_id]) {
                        this.toggle_oi = true;
                    }
                    else {
                        this.toggle_oi = false;
                    }
                }
            });
        // Track appointment_date
        this.patientForm.get('appointment_date').valueChanges.subscribe(
            date => {
                if (new Date(date).toString().toLocaleLowerCase() === 'invalid date') {
                    alert('Invalid appointment date');
                }
                else {
                    this.patientForm.patchValue({
                        days_to: this.dateDiff(date)
                    })
                }
            });
        // Matches spouse to ccc_number
        this.patientForm.get('spouse_ccc').valueChanges.subscribe(
            value => {
                this._patientService.getPatientCCC(value).subscribe(
                    response => {
                        if (response.msg == 'true') {
                            this.spouse_match_alert = 'The value matches an existing patient';
                        }
                        else {
                            this.spouse_match_alert = null;
                        }
                    },
                    err => console.error(err)
                );
            }
        );
        // Track for edit changes in prophylaxis control
        this.patientForm.get('prophylaxis').valueChanges.subscribe(
            value => {
                if (this.toggle_prophylaxis_check) {
                    let last = value[value.length - 1]; // Recent value selected by the user
                    let selectedOptions = this.prophylaxisOptions.filter(option => value.indexOf(option.id) >= 0); // Returns an array with details of selected options
                    let latestSelection = selectedOptions.find(val => val.id === last); // Get id and name of the recent selection
                    if (typeof latestSelection !== 'undefined') {
                        if (latestSelection.name.toLowerCase() === 'dapsone') {
                            let cotrimoxazole = selectedOptions.find(val => val.name.toLowerCase() === 'cotrimoxazole');
                            // Checks if cotrimoxazole is present and removes it from the selected options
                            if (typeof cotrimoxazole !== 'undefined') {
                                value.splice(value.indexOf(cotrimoxazole.id), 1);
                            }
                        }
                        if (latestSelection.name.toLowerCase() === 'cotrimoxazole') {
                            let dapsone = selectedOptions.find(val => val.name.toLowerCase() === "dapsone");
                            // Checks if dapsone is present and removes it from the selected options
                            if (typeof dapsone !== 'undefined') {
                                value.splice(value.indexOf(dapsone.id), 1);
                            }
                        }
                    }
                    // Trigger the toggle if isoniazid exists in the user's selection
                    let isoniazid = selectedOptions.find(val => val.name.toLowerCase() === "isoniazid");
                    if (typeof isoniazid !== "undefined") {
                        this.toggle_isoniazid_dates = true;
                    }
                    else {
                        this.toggle_isoniazid_dates = false;
                    }
                }
            }
        )
        // Monitor the patient ccc_number
        if (!this.edit) {
            this.patientForm.get('ccc_number').valueChanges.subscribe(
                value => {
                    this._patientService.getPatientCCC(value).subscribe(
                        response => {
                            if (response.msg == 'true') {
                                this.ccc_number_warning = 'The ccc number is already in use';
                            }
                            else {
                                this.ccc_number_warning = null
                            }
                        },
                        err => console.error(err)
                    );
                }
            );
        }

        this.patientForm.get('status').valueChanges.subscribe(
            value => {
                if (value == 'concordant') {
                    this.patientForm.patchValue({
                        disclosure: '1'
                    });
                }
                else {
                    this.patientForm.patchValue({
                        disclosure: '0'
                    });
                }
            }
        );

        this.patientForm.get('start_date').valueChanges.subscribe(
            value => {
                if (this.patientForm.get('tb_category').value !== '' && this.patientForm.get('tb_phase').value !== '') {
                    this.tbEndCalculator(value);
                }
            }
        );

        this.patientForm.get('isoniazid_start').valueChanges.subscribe(
            value => {
                if (typeof value !== 'undefined') {
                    this.patientForm.patchValue({
                        isoniazid_end: this.dateCalc(value, 168)
                    })
                }
            }
        );

        // Only required for the edit page
        if (this.formType === 'edit') {
            this._patientService.getPatient(+[this.patientData[0]]).subscribe(val => this.patientValues(val));
            this._patientService.getLatestVisit(+[this.patientData[0]]).subscribe(val => {
                let latest_visit = val[val.length - 1]; // Access the only property in the array
                if (typeof latest_visit !== 'undefined') {
                    this.patientForm.patchValue({
                        current_weight: latest_visit.current_weight,
                        current_height: latest_visit.current_height,
                        current_regimen_id: latest_visit.current_regimen_id
                    })
                }
                else {
                    console.log('Patient is yet to visit')
                }
            });
        }
    }

    today(): string {
        let date = new Date();
        return this._datePipe.transform(date, 'y-MM-dd'); // using angular's built in date pipe to format date object.
    }

    ngDoCheck(): void {
        // Dynamically sets the multiselect values to the form.
        let height = this.patientForm.get('initial_height').value;
        let weight = this.patientForm.get('initial_weight').value;
        let current_height = this.patientForm.get('current_height').value;
        let current_weight = this.patientForm.get('current_weight').value;
        this.patientForm.patchValue({
            initial_bsa: Math.sqrt((height * weight) / 3600)
        });
        if (current_height && current_weight) {
            this.patientForm.patchValue({
                current_bsa: Math.sqrt((current_height * current_weight) / 3600),
            });
        }
    }

    /**
     * Patches the patient details to the form
     * @param patient 
     */
    patientValues(patient: Patient) {
        this.setDate(patient.birth_date, 'birthday');
        if (patient.next_appointment_date) {
            if (new Date(patient.next_appointment_date).toString().toLocaleLowerCase() !== 'invalid date') {
                this.setDate(patient.next_appointment_date, 'appointment');
                this.patientForm.patchValue({
                    days_to: this.dateDiff(patient.next_appointment_date)
                })
            }
            else {
                this.patientForm.patchValue({
                    days_to: 0
                })
            }
        }
        if (patient.tb !== null) {
            // Added this on 6th March. I anticipate no need for tb_end
            this.setDate(patient.tb.start_date, 'tb_start');
            this.tbEndEditCalculator(patient.tb.start_date, patient.tb.category, patient.tb.phase)
            this.patientForm.patchValue({
                tb_category: patient.tb.category,
                tb_phase: patient.tb.phase
            })
        }
        if (patient.other_illnesses !== null) {
            this.patientForm.patchValue({
                other_illness: patient.other_illnesses['illness_name'],
            })
        }
        if (patient.other_drug !== null) {
            this.patientForm.patchValue({
                drug_name: patient.other_drug['drug_name'],
            })
        }
        if (patient.other_drug_allergy !== null) {
            this.patientForm.patchValue({
                allergy_name: patient.other_drug_allergy.allergy_name,
            })
        }
        if (patient.service !== null) {
            this.patientForm.patchValue({
                service_id: patient.service.id,
            })
        }
        if (patient.place_of_birth !== null) {
            this.patientForm.patchValue({
                county_sub_id: patient.place_of_birth.id,
            })
        }
        if (patient.prophylaxis !== null && patient.prophylaxis.length !== 0) {
            let selectedOptions: number[] = [];
            for (let item of patient.prophylaxis) {
                selectedOptions.push(item.id);
            }
            this.patientForm.patchValue({
                prophylaxis: selectedOptions,
            })
        }
        if (patient.drug_allergy !== null && patient.drug_allergy.length !== 0) {
            let selectedOptions: number[] = [];
            for (let item of patient.drug_allergy) {
                selectedOptions.push(item.drug_id);
            }
            this.patientForm.patchValue({
                drug_id: selectedOptions,
            })
        }
        if (patient.birth_date !== null) {
            let dob: any = new Date(patient.birth_date);
            let today: any = new Date();
            let age_in_years: number;
            let age_in_months: number;

            age_in_years = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            var y1 = today.getFullYear();
            var y2 = dob.getFullYear();
            age_in_months = (today.getMonth() + y1 * 12) - (dob.getMonth() + y2 * 12);

            this.patientForm.patchValue({
                start_age: age_in_years,
                current_age: age_in_years
            });
        }
        if (patient.illnesses !== null && patient.illnesses.length !== 0) {
            let selectedOptions: number[] = [];
            for (let item of patient.illnesses) {
                selectedOptions.push(item['illness_id']);
            }
            this.patientForm.patchValue({
                illnesses: selectedOptions,
            })
        }
        if (patient.family_planning !== null && patient.family_planning.length !== 0) {
            let selectedOptions: number[] = [];
            for (let item of patient.family_planning) {
                selectedOptions.push(item['family_planning_id']);
            }
            this.patientForm.patchValue({
                family_planning: selectedOptions,
            })
        }
        if (patient.first_visit !== null && typeof patient.first_visit !== 'undefined') {
            this.patientForm.patchValue({
                initial_weight: patient.first_visit['current_weight'],
                initial_height: patient.first_visit['current_height'],
                initial_regimen_id: patient.first_visit['current_regimen_id']
            })
        }
        this.patientForm.patchValue({
            id: patient.id,
            ccc_number: patient.ccc_number,
            first_name: patient.first_name,
            last_name: patient.last_name,
            other_name: patient.other_name,
            birth_date: patient.birth_date,
            initial_weight: patient.initial_weight,
            initial_height: patient.initial_height,
            initial_bsa: patient.initial_bsa,
            phone_number: patient.phone_number,
            physical_address: patient.physical_address,
            gender: patient.gender,
            is_pregnant: patient.is_pregnant,
            is_tb: patient.is_tb,
            is_tb_tested: patient.is_tb_tested,
            is_sms: patient.is_sms,
            is_smoke: patient.is_smoke,
            is_alcohol: patient.is_alcohol,
            enrollment_date: patient.enrollment_date,
            regimen_start_date: patient.enrollment_date,
            facility_id: 1,
            supporter_id: 1,
            who_stage_id: patient.who_stage_id,
            status_id: patient.current_status_id,
            source_id: patient.source_id,
            disclosure: patient.is_disclosure,
            spouse_ccc: patient.tb,
            status: patient.status,
            support_group: patient.support_group,
            alternate_number: patient.alternate_number,
            pep_reason: patient.pep_reason,
            isoniazid_start: patient.isoniazid_start,
            isoniazid_end: patient.isoniazid_end,
            is_support: patient.is_support,
            is_illness: patient.is_illness,
            is_drugs: patient.is_drugs,
            is_allergies: patient.is_allergies
        });
    }

    /**
     * Calculates the end dates of the tb_phases based on
     * tb_category and tb_phase
     */
    tbEndCalculator(val, tb_category = null, tb_phase = null) {
        tb_category = this.patientForm.get('tb_category').value;
        tb_phase = this.patientForm.get('tb_phase').value;
        let tbRange: number;

        if (tb_category == 1 && tb_phase == 'intensive') {
            tbRange = 90
        }
        else if (tb_category == 1 && tb_phase == 'continuation') {
            tbRange = 112
        }
        else if (tb_category == 2 && tb_phase == 'intensive') {
            tbRange = 90
        }
        else if (tb_category == 2 && tb_phase == 'continuation') {
            tbRange = 150
        }
        this.patientForm.patchValue({
            end_date: this.dateCalc(val, tbRange)
        })
    }
    /**
     * NOT EFFICIENT WAY TOO MUCH CODE REUSE!!!!!
     */
    tbEndEditCalculator(val, tb_category = null, tb_phase = null) {
        let tbRange: number;

        if (tb_category == 1 && tb_phase == 'intensive') {
            tbRange = 90
        }
        else if (tb_category == 1 && tb_phase == 'continuation') {
            tbRange = 112
        }
        else if (tb_category == 2 && tb_phase == 'intensive') {
            tbRange = 90
        }
        else if (tb_category == 2 && tb_phase == 'continuation') {
            tbRange = 150
        }
        this.patientForm.patchValue({
            end_date: this.dateCalc(val, tbRange)
        })
    }

    /**
     * Date Calculator
     */
    dateCalc(value, days_to_add) {
        let new_date = new Date(value);
        if (new_date.toString().toLocaleLowerCase() !== 'invalid date') {
            // console.log(new_date)
            let start_date = new Date(new_date.getFullYear(), new_date.getMonth(), new_date.getDate()).getTime();
            console.log(start_date)
            console.log('Days to add ' + days_to_add);
            let expected_end_date = new Date((1000 * 60 * 60 * 24 * days_to_add) + start_date);
            console.log(expected_end_date)
            return this._datePipe.transform(expected_end_date, 'y-MM-dd');
        }
        else {
            console.log(`There's invalid date!`);
            // alert('I goot you!');
        }
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

        return Math.floor((diff / divideBy['d']) + 1);
    }
    /**
     * Methods prefixed with set... modify the property values of
     * the patient's patient.
     */
    setDate(value: any, val: string) {
        if (val == 'birthday') {
            this.patientForm.patchValue({
                birth_date: value
            });
            this.getAge(value);
        }
        if (val == 'tb_start') {
            this.patientForm.patchValue({
                start_date: value
            })
        }
        if (val == 'tb_end') {
            this.patientForm.patchValue({
                end_date: value
            })
        }
        if (val == 'enrollment') {
            this.patientForm.patchValue({
                enrollment_date: value
            })
        }
        if (val == 'regimen') {
            this.patientForm.patchValue({
                regimen_start_date: value
            })
        }
        if (val == 'isoniazid_start') {
            this.patientForm.patchValue({
                isoniazid_start: value
            })
        }
        if (val == 'isoniazid_end') {
            this.patientForm.patchValue({
                isoniazid_end: value
            })
        }
        if (val == 'appointment') {
            this.patientForm.patchValue({
                appointment_date: value
            })
        }
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

        this.patientForm.patchValue({
            age_in_years: age_in_years,
            age_in_months: age_in_months
        });
    }

    setService(value) {
        this._patientService.getService(+[value]).subscribe(regimen => this.regimen = regimen);
    }

    /**
     * Submit form data to the back-end server
     */
    onSubmit(): void {
        if (this.formType == 'edit') {
            this._patientService.updatePatient(this.patientForm.value).subscribe(
                () => this.onUpdateComplete(),
                (error) => { console.log("Error happened" + error) },
                () => { console.log("the subscription is completed") }
            );
        }
        else {
            this._patientService.addPatient(this.patientForm.value).subscribe(
                () => this.onSaveComplete(),
                (error) => { console.log("Error happened" + error) }
            );
        }
        // this.onSaveComplete();
    }

    onSaveComplete() {
        // this.patientForm.reset();
        this.notification('created');
        if (this.dispense) {
            this.router.navigateByUrl(`/patients/dispense`);
        }
        else {
            this.router.navigateByUrl('/patients/list');
        }
        console.log('Created a new patient...');
    }

    onUpdateComplete() {
        // this.patientForm.reset();
        this.notification('updated');
        // this.router.navigateByUrl('/patients/list');
        this.router.navigate(['/patients/list'], { relativeTo: this.route });
    }

    notification(value: string) {
        $.smallBox({
            title: `You have successfully ${value} the patient`,
            content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
            color: "#296191",
            iconSmall: "fa fa-thumbs-up bounce animated",
            timeout: 4000
        });
    }

    ngOnChanges() {
        let id = +[this.patientData[0]];
        this.formType = this.patientData[1];
        if (this.formType == 'edit') {
            this.edit = true;
            this.add = false;
        }
    }

    onChange(value: any): void {
        console.log(value);
    }

    smartWarning(current: string, previous: string) {
        $.SmartMessageBox({
            title: "Warning!! You cannot select Dapsone and Cotrimoxazole at the same time",
            content: `You have currently selected ${current}, ${previous} will be disabled`,
            buttons: '[OK]'
        });
    }
    smartAlert(value: string) {
        $.SmartMessageBox({
            title: "Incorrect Regimen",
            content: value,
            buttons: '[OK]'
        });
    }
    /**
     * Checks for cotrimoxazole and dapsone selection
     * Triggers display of the isoniazid start and end dates.
     */
    activateCheck() {
        this.toggle_prophylaxis_check = true;
    }
    /**
     * Enable the dispense redirection when dispense action's selected
     */
    toggleDispense() {
        this.dispense = true;
    }
    /**
     * Triggered when moving to the next page
     * Restores the sidebar
     */
    ngOnDestroy() {
        this._layoutService.onCollapseMenu();
    }
    /**
     * Trigger prep result
     */
    prepResult() {
        this.toggle_prep_result = true;
    }
}