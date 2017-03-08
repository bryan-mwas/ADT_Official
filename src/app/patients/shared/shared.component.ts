import { Component, OnInit, Input, DoCheck, ViewChild, AfterViewChecked, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatientsService } from '../patients.service';
import { Patient, Service, Status, Regimen, Prophylaxis, Who_stage, Source, Illness, Allergies, FamilyPlanning, PlaceOfBirth } from '../patients';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
    selector: 'patient-form',
    templateUrl: './shared-form.component.html',
    providers: [DatePipe]
})

// TODO: Handle error catching in all subscriptions

export class SharedComponent implements OnInit, DoCheck, OnChanges {

    formType: string;
    @Input() patientData: string[];
    patientForm: FormGroup;

    // Define properties first.
    patient: Patient;
    edit: boolean = false;
    source = new Source;
    service = new Service
    regimen = new Regimen;
    who_stage = new Who_stage;
    errorMessage: string;
    patientServices: Service[];
    patientSources: Source[];
    patientRegimen: Observable<Regimen[]>;
    patientWhostage: Observable<Who_stage[]>;
    familyPlanning: Observable<IMultiSelectOption[]>;
    birth_place: Observable<PlaceOfBirth[]>;
    // Variables to multiselect controls
    family_planning_list: string[];
    chronic_illness_list: string[];
    allergies_list: string[];
    prophylaxis_list: number[] = [];
    status: Observable<any[]>;

    ccc_number_warning: string = null;

    selectedOptions: string[]; // Default selection

    chronicIllness: Observable<IMultiSelectOption[]>;

    allergiesList: Observable<IMultiSelectOption[]>;
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
    ) { }

    ngOnInit(): void {
        this.patientWhostage = this._patientService.getWho_stage();
        this.status = this._patientService.getStatus();
        this.birth_place = this._patientService.getLocation();
        this.familyPlanning = this._patientService.getFamilyPlan();
        this.chronicIllness = this._patientService.getIllness();
        this.allergiesList = this._patientService.getAllergies();
        this._patientService.getProphylaxis().subscribe(prophy => this.prophylaxisOptions = prophy);
        this._patientService.getSource().subscribe(source => this.patientSources = source);
        this._patientService.getServices().subscribe(service => { this.patientServices = service });
        // this._patientService.getRegimen().subscribe(regimen => this.patientRegimen = regimen);
        // Form Builder Logic
        const form = this.patientForm;
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
            is_pregnant: [''],
            is_tb: [''],
            is_tb_tested: [''],
            is_sms: ['0'],
            is_smoke: [''],
            is_alcohol: [''],
            status_id: [''],
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
            disclosure: [''],
            spouse_ccc: [''],
            status: '',
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
            current_age: [{ value: '', disabled: true }]
        });
        // Track for edit changes in prophylaxis control
        this.patientForm.get('prophylaxis').valueChanges.subscribe(
            value => {
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
                    )
                }
            )
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

        if (this.formType !== 'edit') {
            this.patientForm.get('start_date').valueChanges.subscribe(
                value => {
                    this.tbEndCalculator(value);
                }
            );
        }

        this.patientForm.get('isoniazid_start').valueChanges.subscribe(
            value => {
                if (typeof value !== 'undefined') {
                    this.patientForm.patchValue({
                        isoniazid_end: this.dateCalc(value, 168)
                    })
                }
            }
        );
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
        this.setDate(patient.next_appointment_date, 'appointment');
        if (patient.next_appointment_date) {
            this.patientForm.patchValue({
                days_to: this.dateDiff(patient.next_appointment_date)
            })
        }
        if (patient.tb != null) {
            // Added this on 6th March. I anticipate no need for tb_end
            this.setDate(patient.tb.start_date, 'tb_start');
            this.patientForm.patchValue({
                tb_category: patient.tb.category,
                tb_phase: patient.tb.phase
            })
        }
        if (patient.other_drug != null) {
            this.patientForm.patchValue({
                drug_name: patient.other_drug.drug_name,
            })
        }
        if (patient.other_drug_allergy != null) {
            this.patientForm.patchValue({
                allergy_name: patient.other_drug_allergy.allergy_name,
            })
        }
        if (patient.service != null) {
            this.patientForm.patchValue({
                service_id: patient.service.id,
            })
        }
        if (patient.place_of_birth != null) {
            this.patientForm.patchValue({
                county_sub_id: patient.place_of_birth.id,
            })
        }
        if (patient.prophylaxis != null || []) {
            let selectedOptions: number[] = [];
            for (let item of patient.prophylaxis) {
                selectedOptions.push(item.id);
            }
            this.patientForm.patchValue({
                prophylaxis: selectedOptions,
            })
        }
        if (patient.drug_allergy != null || []) {
            let selectedOptions: number[] = [];
            for (let item of patient.drug_allergy) {
                selectedOptions.push(item.drug_id);
            }
            this.patientForm.patchValue({
                drug_id: selectedOptions,
            })
        }
        if (patient.birth_date != null) {
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
        if (patient.illnesses != null || []) {
            let selectedOptions: number[] = [];
            for (let item of patient.illnesses) {
                selectedOptions.push(item.id);
            }
            this.patientForm.patchValue({
                illnesses: selectedOptions,
            })
        }
        if (patient.family_planning != null || []) {
            let selectedOptions: number[] = [];
            for (let item of patient.drug_allergy) {
                selectedOptions.push(item.id);
            }
            this.patientForm.patchValue({
                family_planning: selectedOptions,
            })
        }
        if (patient.first_visit != null) {
            this.patientForm.patchValue({
                initial_weight: patient.first_visit['current_weight'],
                initial_height: patient.first_visit['current_height']
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
            initial_regimen_id: patient.regimen_id,
            current_regimen_id: patient.regimen_id, // TODO: Revise
            facility_id: 1,
            supporter_id: 1,
            who_stage_id: patient.who_stage_id,
            status_id: patient.current_status_id,
            source_id: patient.source_id,
            disclosure: patient.is_disclosure,
            spouse_ccc: patient.tb,
            status: patient.status,
            family_planning: patient.family_planning,
            support_group: patient.support_group,
            alternate_number: patient.alternate_number,
            other_illness: patient.other_illness,
            illnesses: patient.illnesses,
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
    tbEndCalculator(val) {
        const tb_category = this.patientForm.get('tb_category').value;
        const tb_phase = this.patientForm.get('tb_phase').value;
        alert(tb_category);
        alert(`I tb_phase ${tb_phase}`)
        let tbRange: number;

        if (tb_category == 1) {
            if (tb_phase == 'intensive') {
                tbRange = 90
            }
            else if (tb_phase == 'continuation') {
                tbRange = 112
            }
        }
        else if (tb_category == 2) {
            if (tb_phase == 'intensive') {
                tbRange = 90
            }
            else if (tb_phase == 'continuation') {
                tbRange = 150
            }
        }
        if (this.formType == 'edit') {
            alert(`I found ${tbRange}`)
        }
        // alert(tb_category)
        this.patientForm.patchValue({
            end_date: this.dateCalc(val, tbRange)
        })
    }

    /**
     * Date Calculator
     */
    dateCalc(value, days_to_add) {
        let new_date = new Date(value);
        // console.log(new_date)
        let start_date = new Date(new_date.getFullYear(), new_date.getMonth(), new_date.getDate()).getTime();
        console.log(start_date)
        console.log('Days to add ' + days_to_add);
        let expected_end_date = new Date((1000 * 60 * 60 * 24 * days_to_add) + start_date);
        console.log(expected_end_date)
        return this._datePipe.transform(expected_end_date, 'y-MM-dd');
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
    }

    onSaveComplete() {
        // this.patientForm.reset();
        this.notification('created');
        this.router.navigateByUrl('/patients/list');
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
        console.log(this.patientData);
        let id = +[this.patientData[0]];
        this.formType = this.patientData[1];
        if (this.formType == 'edit') {
            this.edit = true;
        }
        this._patientService.getPatient(id).subscribe(val => this.patientValues(val));
        this._patientService.getLatestVisit(id).subscribe(val => {
            let latest_visit = val[val.length - 1]; // Access the only property in the array
            if (typeof latest_visit !== 'undefined') {
                this.patientForm.patchValue({
                    current_weight: latest_visit.current_weight,
                    current_height: latest_visit.current_height
                })
            }
            else {
                console.log('Patient is yet to visit')
            }
        })
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
}