import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-types',
  templateUrl: './transaction-types.component.html',
  styleUrls: ['./transaction-types.component.css']
})
export class TransactionTypesComponent implements OnInit {

  constructor() { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/others.dummy.json',
    columns: [{ data: 'transaction' }, { data: 'description' }, { data: 'effect' }],
    "columnDefs": [
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function (data, type, row) {
          return `
               <div>
               <button class="btn btn-primary" data-toggle="modal" data-target="#edit"> Edit	</button>  
               <button class="btn btn-danger" data-toggle="modal" data-target="#disable"> Disable	</button>
               <div id="edit" class="modal fade" role="dialog">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">Edit</h4>
                    </div>
                    <div class="modal-body">
                      <form>
                      <table class="table">
                      <tr><th>Name</th>
                      <td><input type="text" class="form-control"></td></tr>
                      <tr><th>Description</th>
                      <td><input type="text" class="form-control"></td></tr>
                      <tr><th>Effect</th>
                      <td><input type="text" class="form-control"></td></tr>
                      <tr><td></td><td><button class="btn btn-primary" type="submit"><i class="fa fa-save"></i> Update	</button>
                      <button class="btn btn-danger" data-dismiss="modal"> Cancel	</button></td>
                      </table>
                    </form>
                    </div>
                  </div>
                </div>
              </div>
              <div id="disable" class="modal fade" role="dialog">
                <div class="modal-dialog modal-sm">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">Disable</h4>
                    </div>
                    <div class="modal-body">
                      <form>
                        <h3>Are you sure?</h3>
                        <div style="text-align: right">
                        <button class="btn btn-primary"> Disable	</button>
                        <button class="btn btn-danger" data-dismiss="modal"> Cancel	</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>                            
              </div>
              `
          // return '<a class="btn btn-primary btn-xs" href="patients/dispense/' + row['id'] + '">Dispense</a> <a class="btn btn-primary btn-xs" href="patients/view/' + row['id'] + '">Detail</a>'
        },
        // NOTE: Targeting the [actions] column.
        "targets": 3
      },
      { "targets": 0 }
    ],
    responsive: true
  }

  ngOnInit() {
  }

}
