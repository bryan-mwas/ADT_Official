import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { OrdersService } from '../orders.service';

@Component({
    template: `<cdrr-template [item]="cdrr_item"></cdrr-template>`
})
export class ViewCdrrComponent implements OnInit {
    public cdrr_item: any[] = [];
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _ordersService: OrdersService,
    ) { }
    ngOnInit() {
        this._activatedRoute.params.subscribe(
            params => {
                this.cdrr_item.push(params['id'], 'view')
            }
        )
    }
}