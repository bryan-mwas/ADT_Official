import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regimen-management',
  templateUrl: './regimen-management.component.html',
  styleUrls: ['./regimen-management.component.css']
})
export class RegimenManagementComponent implements OnInit {

  constructor() { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/regimen.dummy.json',
    columns: [{data: 'regimen'}, {data: 'line'}, {data: 'regimen_category'}, {data: 'type_of_service'}],
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
               <button class="btn btn-success" data-toggle="modal" data-target="#merge"> Merge	</button>
               <div id="edit" class="modal fade" role="dialog">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">Edit</h4>
                    </div>
                    <div class="modal-body">
                      <form>
                      <table style="width: 100%" class="table">
                        <tbody>
                          <tr>
                            <th>Regimen Code</th>
                            <td><input type="text" class="form-control"></td>
                          </tr>
                          <tr>
                            <th>Description</th>
                            <td><input type="text" class="form-control"></td>
                          </tr>
                          <tr>
                            <th>Category</th>
                            <td><select class="form-control" id="select-1">
                                <option>Adult ART Third Line Regimens</option>
                                <option>Adult Second Line</option>
                              </select></td>
                          </tr>
                          <tr>
                            <th>Line</th>
                            <td><input type="text" class="form-control"></td>
                          </tr>
                          <tr>
                            <th>Type of Service</th>
                            <td><select class="form-control" id="select-1">
                                <option>ART</option>
                                <option>PEP</option>
                                <option>PMTCT</option>
                              </select>
                              </td>
                          </tr>
                          <tr>
                            <th>Remarks</th>
                            <td><textarea rows="4" style="width: 100%"></textarea></td>
                          </tr>
                          <tr>
                            <th>Mapping</th>
                            <td>
                              <select class="form-control" id="select-1">
                                <option> AF1A | AZT + 3TC + NVP</option>
                                <option> AF2B | TDF + 3TC + EFV</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="text-align: right"><button class="btn btn-primary" type="submit"><i class="fa fa-save"></i> Update	</button>
                            <button class="btn btn-primary" data-dismiss="modal"> Cancel	</button></td>
                          </tr>
                        </tbody>
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
              <div id="merge" class="modal fade" role="dialog">
                <div class="modal-dialog modal-sm">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">Merge</h4>
                    </div>
                    <div class="modal-body">
                      <form>
                        <h3>Are you sure?</h3>
                        <div style="text-align: right">
                        <button class="btn btn-primary"> Merge	</button>
                        <button class="btn btn-danger" data-dismiss="modal"> Cancel	</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>                            
              </div>
              `              
            },
            // NOTE: Targeting the [actions] column.
            "targets": 4
          },
          { "targets": 0 }
        ],       
    responsive: true
  }

  ngOnInit() {
  }

}
