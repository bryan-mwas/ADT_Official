import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from '../inventory.service';
import 'rxjs/add/operator/switchMap';
import { IDrugs, Store, StockDrugs } from '../drugs';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {


  drugs: StockDrugs[];
  store = new Store();
  public currentPage: number = 1;

  constructor(
    private _inventoryService: InventoryService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this._route.params
      .switchMap((params: Params) => this._inventoryService.thisStore(+params['id']))
      .subscribe(store => this.store = store);
    // this._inventoryService.getDrugs().subscribe(
    // response => this.drugs = response,
    // error => console.error(error)
    // );
    this._route.params
      .switchMap((params: Params) => this._inventoryService.getDrugsbyStore(+params['id']))
      .subscribe(z => this.drugs = z);
  }
}
