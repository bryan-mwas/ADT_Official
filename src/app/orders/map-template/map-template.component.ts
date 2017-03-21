import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OrdersService } from '../orders.service';
@Component({
  selector: 'map-template',
  templateUrl: './map-template.component.html',
  styleUrls: ['./map-template.component.css']
})
export class MapTemplateComponent implements OnInit {

  public mapForm: FormGroup;
  public map_item: Object;
  public monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  constructor(
    private _activeRoute: ActivatedRoute,
    private _orderService: OrdersService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this._activeRoute.params.switchMap((params: Params) => this._orderService.getIndividualMapOrderDetails(+params['id'])).subscribe(response => {
      this.map_item = response;
      this.mapForm.patchValue({
        period_begin: this.periodStringifier(response, 'period_begin'),
        period_end: this.periodStringifier(response, 'period_end')
      })
    })
    this.mapForm = this._fb.group({
      period_begin: [{ value: '', disabled: true }],
      period_end: [{ value: '', disabled: true }]
    })
  }
  /**
   * GETs the name of the month and year from a date (yyyy-mm-dd)
   * @param map -> contains period begin and end dates.
   * @param field 
   */
  periodStringifier(map: any, field: string) {
    let a = map[field].split('-');
    // Get the month from the date.
    let month = this.monthsList[parseInt(a[1], 10) - 1];
    let year = a[0];
    let report_period: string = month + ' ' + year;
    console.log(month, year);
    return report_period;
  }
}
