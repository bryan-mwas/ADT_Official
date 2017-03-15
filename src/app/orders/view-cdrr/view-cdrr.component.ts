import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms'
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-view-cdrr',
  templateUrl: './view-cdrr.component.html',
  styleUrls: ['./view-cdrr.component.css']
})
export class ViewCdrrComponent implements OnInit {
  public cdrr_item: any[];
  public cdrrForm: FormGroup;
  public monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _ordersService: OrdersService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this._activatedRoute.params.switchMap((params: Params) => this._ordersService.getIndividualCdrrOrderDetails(+params['id'])).subscribe(
      cdrr => {
        this.cdrr_item = cdrr;
        let a = cdrr['period_begin'].split('-');
        // Get the month from the date.
        let month = this.monthsList[parseInt(a[1], 10) - 1];
        let year = a[0];
        let report_period: string = month+' '+year;
        console.log(month, year);
        this.cdrrForm.patchValue({
          arv: cdrr['is_non_arv'],
          reporting_period: report_period
        })
      }
    )
    this.cdrrForm = this._fb.group({
      arv: '',
      reporting_period: [{value:'', disabled: true}]
    })
  }

}
