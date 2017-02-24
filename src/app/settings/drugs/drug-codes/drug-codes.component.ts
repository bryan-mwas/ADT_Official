import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drug-codes',
  templateUrl: './drug-codes.component.html',
  styleUrls: ['./drug-codes.component.css']
})
export class DrugCodesComponent implements OnInit {

  constructor() { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/drugs.dummy.json',
    columns: [{ data: 'drug' }, { data: 'unit' }, { data: 'dose' }, { data: 'supplier' }],
    "columnDefs": [
      {
        "render": function (data, type, row) {
          return `           
              <div>
               <button class="btn btn-primary" data-toggle="modal" data-target="#edit"> Edit	</button>  
               <button class="btn btn-danger" data-toggle="modal" data-target="#disable"> Disable	</button>
               <button class="btn btn-success" data-toggle="modal" data-target="#merge"> Merge	</button>
               <div id="edit" class="modal fade" role="dialog">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">Edit</h4>
                    </div>
                    <div class="modal-body">
                       <form>
                      <div>
                        <fieldset class="col-xs-6">
                          <legend>Drug Details</legend>                          
                            <label>Drug ID</label>
                              <input type="text" class="form-control">                                                    
                            <label>Unit</label>
                              <select class="form-control" id="select-1">
                                <option> Amp</option>
                                <option> Bottle</option>
                              </select>
                            <label>Packet Size</label>
                              <input type="text" class="form-control">
                            <label>Generic Name</label>
                              <select class="form-control" id="select-1">
                                <option> ABACAVIR</option>
                                <option> AMOXYCILLIN </option>
                              </select>
                            <label>Supplied By</label>
                              <select class="form-control" id="select-1">
                                <option>Tivoli</option>
                                <option>PEPFAR Meds</option>
                                <option>KEMSA</option>
                              </select>
                            <label>Classification</label>
                              <select class="form-control" id="select-1">
                                <option> ART</option>
                                <option> Family Planning</option>
                              </select> 
                              <hr>
                              <label class="checkbox-inline"><input class="form" type="checkbox">Non-ARV Drug</label>
                              <label class="checkbox-inline"><input class="form" type="checkbox">TB Drug</label>           
                        </fieldset>
                        <fieldset class="col-xs-6">
                          <legend>Standard Dispensing Information</legend>                          
                            <label>Dose Strength</label>
                              <select class="form-control" id="select-1">
                                <option> Mg</option>
                                <option>Ml</option>
                              </select>  
                            <label>Dose</label>
                              <select class="form-control" id="select-1">
                                <option> 1 STAT</option>
                                <option> Bottle</option>
                              </select>
                            <label>Duration</label>
                              <input type="text" class="form-control"> 
                            <label>Quantity</label>
                              <input type="text" class="form-control">
                            <label>Comments</label>
                              <textarea rows="4" style="width: 100%"></textarea>
                            <label>Mapping</label>
                              <select class="form-control" id="select-1">
                                <option> Dapsone</option>
                                <option> Darunavir</option>
                              </select>
                            <label>Instructions</label>                                 
                              <select class="form-control" id="select-1">
                                <option>Warning. May cause drowsiness</option>
                                <option>Warning. May cause drowsiness</option>
                              </select> 
                          </fieldset>
                       </div>
                      <button class="btn btn-primary" type="submit"><i class="fa fa-save"></i> Save	</button>
                      <button class="btn btn-primary" data-dismiss="modal"> Cancel	</button>
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
        "targets": 4
      },
      { "targets": 0 }
    ],
    responsive: true
  }

  ngOnInit() {
  }

}
