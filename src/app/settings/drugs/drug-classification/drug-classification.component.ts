import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drug-classification',
  templateUrl: './drug-classification.component.html',
  styleUrls: ['./drug-classification.component.css']
})
export class DrugClassificationComponent implements OnInit {

  constructor() { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/drugs.dummy.json',
    columns: [{ data: 'classification' }],
    "columnDefs": [
      {
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
                        <label>Name</label>
                        <p><input type="text" class="form-control" style="width:100%"></p>
                        <button class="btn btn-primary" type="submit"><i class="fa fa-save"></i> Update	</button>
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
              </div>
              `
        },
        "targets": 1
      },
      { "targets": 0 }
    ],
    responsive: true
  }

  ngOnInit() {
  }

}
