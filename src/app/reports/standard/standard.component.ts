import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from '../../shared/layout/layout.service';

@Component({
    selector: 'standard',
    templateUrl: 'standard.component.html'
})
export class StandardComponent implements OnInit, OnDestroy {
    standardReport: FormGroup;
    enrolledInPeriod: FormGroup;
    constructor(
        private _fb: FormBuilder,
        private _layoutService: LayoutService) { }

    ngOnInit() {
        this.standardReport = this._fb.group({
            type: ''
        });
        this.enrolledInPeriod = this._fb.group({});
        this._layoutService.onCollapseMenu();
    }

    ngOnDestroy() {
        this._layoutService.onCollapseMenu();
    }
}
