import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Transaction, StockItem, Drug } from './transactions';
import { StockTransactionsService } from './stock-transactions.service';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-stock-transactions',
  templateUrl: './stock-transactions.component.html',
  styleUrls: ['./stock-transactions.component.css'],
  providers: [StockTransactionsService]
})
export class StockTransactionsComponent implements OnInit, DoCheck {

  stockTransactionsForm: FormGroup;
  transaction: Transaction;
  private transactionTypes: Observable<string[]>;
  stockItem: Transaction;
  drugItem: Drug;
  //  Index Tracker
  i: number;
  individual_drug: any = null;
  get rows(): FormArray {
    return <FormArray>this.stockTransactionsForm.get('drugs');
  }

  constructor(
    private fb: FormBuilder,
    private _transactionService: StockTransactionsService) { }

  ngOnInit() {
    this.stockTransactionsForm = this.fb.group({
      transaction_date: ['', Validators.required],
      transaction_type: ['', Validators.required],
      ref_no: ['', Validators.required],
      destination: [''],
      source: [''],
      drugs: this.fb.array([this.buildRow()]),
    });
    this._transactionService.getTransactionTypes().subscribe(data => this.transactionTypes = data);
    this.stockTransactionsForm.get('transaction_type').valueChanges.subscribe(
      val => this._transactionService.getTransaction(+[val]).subscribe((val) => this.stockItem = val),
      (err) => console.error(err)
    )
    // console.log(this.rows.controls[0] + 'index: ' + this.index);
  }

  ngDoCheck() {
    // let control = <FormArray>this.stockTransactionsForm.controls['drugs'];
    // console.log(control[0]);
  }

  buildRow(): FormGroup {
    return this.fb.group({
      drug_id: [''],
      unit: [{ value: '', disabled: true }],
      pack_size: [{ value: '', disabled: true }],
      batch_number: '',
      expiry_date: '',
      packs: '',
      quantity: '',
      available_quantity: [{ value: '', disabled: true }],
      pack_cost: '',
      total: [{ value: '', disabled: true }],
      comment: ''
    });
  }

  setDate(value: any, val: string) {
    this.stockTransactionsForm.patchValue({
      transaction_date: value
    })
  }

  addRow() {
    this.rows.push(this.buildRow());
  }

  removeRow(i: number) {
    const control = <FormArray>this.stockTransactionsForm.controls['drugs'];
    control.removeAt(i);
  }

  drugRetrieval(val) {
    this.stockTransactionsForm.get('drug').valueChanges.subscribe(
      val => this._transactionService.getDrugDetails(val).subscribe((val) => this.drugItem = val),
      (err) => console.error(err)
    )
    this.stockTransactionsForm.patchValue({
      unit: this.drugItem[0].pack_size
    })
  }

  /**
   * Tracks the index of the rows being worked on.
   */

  index(val: any) {
    const array_index: number = +[val];
    // Allows control to an indivual row [item] in a form array for better control
    this.rows.controls[+val].valueChanges.subscribe(
      row => {
        this._transactionService.getDrugDetails(+[row.drug_id]).subscribe(
          individual_drug => this.patchRow(individual_drug, array_index)
        )
      }
    )
  }

  patchRow(drug: any, val: number) {
    let p = this.rows.controls[+[val]].get('packs').value;
    let pc = this.rows.controls[+[val]].get('pack_cost').value;
    let ps = this.rows.controls[+[val]].get('pack_size').value;
    this.rows.controls[+[val]].patchValue(
      {
        unit: drug.unit_id,
        pack_size: drug.pack_size,
        total: (p * pc),
        quantity: (ps * p)
      }
    );
  }  
}