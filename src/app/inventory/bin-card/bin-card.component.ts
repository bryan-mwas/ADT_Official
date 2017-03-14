import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { IStockDrug, ITransactionDetail } from '../drugs';
import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'app-bin-card',
  templateUrl: './bin-card.component.html',
  styleUrls: ['./bin-card.component.css']
})
export class BinCardComponent implements OnInit {

  transactions: ITransactionDetail[];
  batches: ITransactionDetail[];
  public currentPage: number = 1;

  constructor(
    private _route: ActivatedRoute,
    private _inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this._route.params
      .switchMap((params: Params) => this._inventoryService.getDrugTransactions(1, +params['id']))
      .subscribe(res => this.transactions = res);
    this._route.params
      .switchMap((params: Params) => this._inventoryService.getViableBatches(1, +params['id']))
      .subscribe(res => this.batches = res);
  }

}
