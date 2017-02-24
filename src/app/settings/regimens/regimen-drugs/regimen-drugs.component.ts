import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regimen-drugs',
  templateUrl: './regimen-drugs.component.html',
  styleUrls: ['./regimen-drugs.component.css']
})
export class RegimenDrugsComponent implements OnInit {

  constructor() { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/regimen.dummy.json',
    columns: [{data: 'regimen'}, {data: 'type_of_service'}],
    "columnDefs": [
          {
            // The `data` parameter refers to the data for the cell (defined by the
            // `data` option, which defaults to the column being worked with, in
            // this case `data: 0`.
            "render": function (data, type, row) {
              return `
               <div>
               <button class="btn btn-primary" data-toggle="modal" data-target="#list"> View List of Drugs	</button>
               <div id="list" class="modal fade" role="dialog">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">List of Drugs</h4>
                    </div>
                    <div class="modal-body">
                      <table class="table">
                        <tr><th>Drug</th><th>Option</th></tr>
                        <tr><td>AZT/3TC FDC (300MG/150MG)TABS</td><td><button class="btn btn-danger btn-xs"> Disable	</button></td></tr>
                        <tr><td>AZT/3TC/NVP FDC (300MG/150MG/200MG)</td><td><button class="btn btn-danger btn-xs"> Disable	</button></td></tr>
                        <tr><td>ABACAVIR (ABC) Liquid 20MG/ML (240ml)</td><td><button class="btn btn-danger btn-xs"> Disable	</button></td></tr>
                      </table>
                      <button class="btn btn-primary" data-dismiss="modal"> Dismiss	</button>
                    </div>
                  </div>
                </div>
              </div>           
              </div>
              `
              // return '<a class="btn btn-primary btn-xs" href="patients/dispense/' + row['id'] + '">Dispense</a> <a class="btn btn-primary btn-xs" href="patients/view/' + row['id'] + '">Detail</a>'
            },
            // NOTE: Targeting the [actions] column.
            "targets": 2
          },
          { "targets": 0 }
        ],       
    responsive: true
  }


  ngOnInit() {
  }

}
