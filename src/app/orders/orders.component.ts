import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { Order, Facility } from './orders';
import { Observable } from 'rxjs/Observable';
// import { ModalDirective } from "ng2-bootstrap";
// import { ViewChild } from "@angular/core/src/metadata/di";

declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public state: any = {
    tabs: {
      demo1: 0,
      demo2: 'tab-r1',
      demo3: 'hr1',
      demo4: 'AA',
      demo5: 'iss1',
      demo6: 'l1',
      demo7: 'tab1',
      demo8: 'hb1',
      demo9: 'A1',
      demo10: 'is1'
    }
  }

  cdrrList: Order[];
  cdrr = new Order();
  mapsList: Order[];
  maps = new Order();
  private facilityDetails: Observable<String[]>

  constructor(private _ordersService: OrdersService) { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/orders.dummy.json',
    columns: [{ data: 'id' }, { data: 'period_beginning' }, { data: 'status' }, { data: 'facility_name' }],
    "columnDefs": [
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function (data, type, row) {
          return `
               <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Options
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                  <li><a href="/orders/view-cdrr">View</a></li>
                  <li><a href="/orders/update-cdrr">Update</a></li>
                  <li><a>Delete</a></li>
                  <li><a>Download</a></li>
                </ul>
              </div>
              `
          // return '<a class="btn btn-primary btn-xs" href="patients/dispense/' + row['id'] + '">Dispense</a> <a class="btn btn-primary btn-xs" href="patients/view/' + row['id'] + '">Detail</a>'
        },
        // NOTE: Targeting the [actions] column.
        "targets": 4
      },
      { "width": "10%", "targets": 0 }
    ],
    responsive: true
  }

  ngOnInit(): void {
    this._ordersService.getCdrrOrderDetails().subscribe(data => this.cdrrList = data);
    this._ordersService.getMapOrderDetails().subscribe(data => this.mapsList = data);
    // this._ordersService.getFacilityDetails().subscribe(data => this.facilityDetails = data);
  }

}
