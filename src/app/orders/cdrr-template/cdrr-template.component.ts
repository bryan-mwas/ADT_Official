import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { OrdersService } from '../orders.service';

@Component({
  selector: 'cdrr-template',
  templateUrl: './cdrr-template.component.html',
  styleUrls: ['./cdrr-template.component.css']
})
export class CdrrTemplateComponent implements OnInit, OnChanges {
  @Input() public item: any[] = [];
  public cdrr_item: any[] = [];
  public cdrrForm: FormGroup;
  public category_drugs: any[] = [];
  public tmp: Object[] = [];
  public distinct: number[] = [];
  public monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  get rows(): FormArray {
    return <FormArray>this.cdrrForm.get('drugs');
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _ordersService: OrdersService,
    private _fb: FormBuilder
  ) { }

  setDrugs(drugs: any[]) {
    const drugsFGs = drugs.map(drugs => this._fb.group(drugs));
    console.log(drugsFGs)
    const drugsFormArray = this._fb.array(drugsFGs);
    this.cdrrForm.setControl('drugs', drugsFormArray);
    const drugsControl = this.cdrrForm.get('drugs');
    // console.log(this.rows.controls['drug_id']);
  }

  ngOnInit() {
    this.cdrrForm = this._fb.group({
      arv: '',
      reporting_period: [{ value: '', disabled: true }],
      drugs: this._fb.array([this.buildRows()]),
    });
    this.cdrrForm.get('drugs').valueChanges.subscribe(
      el => console.log(el)
    );
    this._ordersService.getCdrrCategoryDrugs().subscribe(
      all => {
        let categoryDrugs = Object.keys(all).map(function (k) { return all[k] }); // converts object to array
        categoryDrugs.map(all_drugs => {
          all_drugs.forEach(el => {
            this.tmp.push(el)
          });
        });
        this.tmp.map(value => {
          let modified_drugs: any[] = [];
          for (let item of this.tmp) {
            // Appends properties to the array. Intended for the form array
            item['balance'] = '';
            item['received'] = '';
            item['dispensed_packs'] = '';
            item['dispensed_units'] = '';
            item['losses'] = '';
            item['adjustments_pos'] = '';
            item['adjustments_neg'] = '';
            item['count'] = '';
            item['expiry_quantity'] = '';
            item['out_of_stock'] = '';
            item['resupply'] = '';
            item['aggr_consumed'] = '';
            item['aggr_on_hand'] = '';
            item['expiry_date'] = '';
            delete item['quantity'];
            modified_drugs.push(item);
          }
          return modified_drugs;
        })
        this.category_drugs = this.tmp;
        // this.setDrugs(this.category_drugs); // Populate drugs table
        var unique = {};
        var distinct = [];
        for (var i in this.category_drugs) {
          if (typeof (unique[this.category_drugs[i].category_name]) == "undefined") {
            // console.log(i)
            // Pushes the index of the first occurenece of the unique category name
            this.distinct.push(+[i]);
          }
          unique[this.category_drugs[i].category_name] = 0;
        }
        console.log(all, JSON.stringify(this.category_drugs));
      }
    )
  }
  buildRows(): FormGroup {
    return this._fb.group({
      drug_unit: '',
      balance: '',
      received: '',
      dispensed_packs: '',
      dispensed_units: '',
      losses: '',
      adjustments_pos: '',
      adjustments_neg: '',
      count: '',
      expiry_quantity: '',
      out_of_stock: '',
      resupply: '',
      aggr_consumed: '',
      aggr_on_hand: '',
      expiry_date: '',
      pack_size: '',
      category_id: '',
      category_name: ''
    })
  }
  ngOnChanges() {
    if (typeof this.item !== 'undefined') {
      this._ordersService.getIndividualCdrrOrderDetails(+this.item[0]).subscribe(
        cdrr => {
          this.cdrr_item = cdrr;
          let a = cdrr['period_begin'].split('-');
          if (typeof a[0] === 'undefined') {
            alert(`Something's up! Contact Tech Support`);
          }
          else {
            // Get the month from the date.
            let month = this.monthsList[parseInt(a[1], 10) - 1];
            let year = a[0];
            let report_period: string = month + ' ' + year;
            console.log(month, year);
            this.cdrrForm.patchValue({
              arv: cdrr['is_non_arv'],
              reporting_period: report_period
            });
          }
        }
      );
      // Load CDRR Items
      this._ordersService.getCdrrItem(+[this.item[0]]).subscribe(
        (item: any[]) => {
          item.forEach(element => {
            delete element['drug_unit'];
            element['category_id'] = '';
            element['category_name'] = '';
            element['pack_size'] = ''; // for now
          });
          console.log(item)
          this.setDrugs(item);
          let a = this.rows.controls;
          console.log(a)
          for (let b of a) {
            console.log(b);
            // Iterate over the controls [Object type] and disable them.
            for (var prop in b['controls']) {
              b.get(`${prop}`).disable();
            }
          }
        }
      )
    }
  }
  /**
   * Calculates the phyical count and resupply (Triggered on keyup)
   * @param value 
   * @param index 
   * @param optional 
   */
  calcBalance(value: number, index: number, optional: string = null) {
    // QUICK NOTE: if the string value is " ", parsing it (string) defaults to 0
    let packs = +[this.rows.get(`${index}.pack_size`).value];
    let balance = +[this.rows.get(`${index}.balance`).value];
    let received = +[this.rows.get(`${index}.received`).value];
    let positive = +[this.rows.get(`${index}.adjustments_pos`).value];
    let negative = +[this.rows.get(`${index}.adjustments_neg`).value];
    let losses = +[this.rows.get(`${index}.losses`).value];
    let dispensed = +[this.rows.get(`${index}.dispensed_units`).value];
    let dispensed_packs = +[this.rows.get(`${index}.dispensed_packs`).value];
    let count = +[this.rows.get(`${index}.count`).value];

    if (optional === 'dispensed') {
      let new_dispensed_packs = packs * dispensed;
      this.rows.controls[+[index]].patchValue({
        dispensed_packs: new_dispensed_packs,
      })
    }
    // Calculation of recent physical count and resupply respectively.
    let new_count = (received + balance + positive) - (losses + dispensed + negative);
    let resupply = (dispensed * 3) - count;
    this.rows.controls[+[index]].patchValue({
      count: new_count,
      resupply: resupply
    })

    console.log(new_count);
  }
}
