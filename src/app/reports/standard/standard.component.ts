import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'standard',
    templateUrl: 'standard.component.html'
})
export class StandardComponent implements OnInit {
    standardReport: FormGroup;
    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this.standardReport = this._fb.group({
            type: ''
        });
    }
}
