import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Types, Transaction, StockItem, Drug, StoreItem } from './transactions';
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
  //  Index Tracker
  i: number;
  individual_drug: any = null;
  transaction: Transaction;
  stockItem: Transaction;
  drugItem: Drug;
  private transactionTypes: Observable<string[]>;
  private drugsList: Observable<string[]>;
  private storeItems: StoreItem;
  private batchList: Observable<string[]>;
  private indiv: Observable<string[]>;

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
      val => this._transactionService.getTransaction(+[val])
        .subscribe((val) => this.stockItem = val),
      (err) => console.error(err)
    );
    this._transactionService.getDrugs().subscribe(d => this.drugsList = d);
    this._transactionService.getItems().subscribe(i => this.storeItems = i);
    // console.log(this.rows.controls[0] + 'index: ' + this.index);
  }

  buildRow(): FormGroup {
    return this.fb.group({
      drug_id: '',
      unit: '',
      pack_size: '',
      batch_number: '',
      expiry_date: '',
      packs: '',
      quantity: '',
      available_quantity: '',
      pack_cost: '',
      total: '',
      comment: ''
    });
  }

  setDate(value: any, val: string) {
    this.stockTransactionsForm.patchValue({
      transaction_date: value
    });
  }

  addRow() {
    this.rows.push(this.buildRow());
  }

  removeRow(i: number) {
    this.rows.removeAt(i);
  }

  getIndividualDrug(id: number, index: number) {
    this._transactionService.getDrugDetails(+[id]).subscribe(
      individualDrug => this.patchRow(individualDrug, index)
    );
    this._transactionService.getDrugBatches(1, +[id]).subscribe(i => this.batchList = i);
  }

  getBatchDetails(batchNo: string, index: number) {
    this._transactionService.getDrugBatchDetails(1, batchNo).subscribe(
      individualBatch => this.patchBatch(individualBatch, index)
    );
  }

  index(val: any) {
    this.i = +[val];
  }

  patchRow(drug: any, val: number) {
    this.rows.controls[+[val]].patchValue(
      {
        unit: drug.drug_unit,
        pack_size: drug.pack_size,
      }
    );
  }

  patchBatch(batch: any, val: number) {
    this.rows.controls[+[val]].patchValue(
      {
        expiry_date: batch.expiry_date,
        available_quantity: batch.balance,
        comment: batch.comment
      }
    );
  }

  ngDoCheck() {
    if (this.i != null) {
      let currentRow = this.rows.controls[this.i].value;
      console.log('Row: ' + JSON.stringify(currentRow));
      let p = currentRow.packs;
      let pc = currentRow.pack_cost;
      let ps = currentRow.pack_size;
      this.rows.controls[this.i].patchValue({
        total: (p * pc),
        quantity: (ps * p)
      });
    }
  }
}
