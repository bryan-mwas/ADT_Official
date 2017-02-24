import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-merging',
  templateUrl: './patient-merging.component.html',
  styleUrls: ['./patient-merging.component.css']
})
export class PatientMergingComponent implements OnInit {

  constructor() { }

  tableOptions: Object = {
    colReorder: true,
    ajax: 'assets/api/tables/others.dummy.json',
    columns: [{ data: 'ccc_no' }, { data: 'patient' }],
    "columnDefs": [
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function (data, type, row) {
          return `
               <div>
               <button class="btn btn-success" data-toggle="modal" data-target="#merge"> Merge	</button>              
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
                        <button class="btn btn-primary" type="submit"> Merge	</button>
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
        "targets": 2
      },
      { "targets": 0 }
    ],
    responsive: true
  }

  ngOnInit() {
  }

}
