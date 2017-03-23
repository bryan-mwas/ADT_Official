import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
// import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { OrdersService } from '../orders.service';
@Component({
    template: `<cdrr-template [item]="new_item"></cdrr-template>`
})
export class NewCdrrComponent implements OnInit {
    public new_item: string[] = [];
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _ordersService: OrdersService,
    ) { }
    ngOnInit() {
        this._activatedRoute.params.subscribe(
            params => {
                this.new_item.push(params['id'], 'new')
            }
        )
    }
}