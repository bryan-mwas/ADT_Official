import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { IStockDrug } from '../drugs';
import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'app-bin-card',
  templateUrl: './bin-card.component.html',
  styleUrls: ['./bin-card.component.css']
})
export class BinCardComponent implements OnInit {

  stock: IStockDrug[];

  constructor(
    private route: ActivatedRoute,
    private service: InventoryService
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.service.getStockDrug(+params['id']))
      .subscribe(res => this.stock = res);
  }

}
