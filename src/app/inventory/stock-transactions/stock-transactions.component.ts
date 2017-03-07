import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Types, Transaction, StockItem, Drug, StoreItem, Store } from './transactions';
import { StockTransactionsService } from './stock-transactions.service';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

declare var $: any;

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
  individualDrug: any = null;
  transaction: Transaction;
  stockItem: Transaction;
  drugItem: Drug;
  private storesList: Observable<string[]>;
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
    private _transactionService: StockTransactionsService,
    private router: Router) { }

  ngOnInit() {
    this.stockTransactionsForm = this.fb.group({
      transaction_time: ['', Validators.required],
      transaction_type_id: ['', Validators.required],
      ref_number: ['', Validators.required],
      store_id: '',
      store: '',
      drugs: this.fb.array([this.buildRow()]),
    });
    this._transactionService.getTransactionTypes().subscribe(data => this.transactionTypes = data);
    this.stockTransactionsForm.get('transaction_type_id').valueChanges.subscribe(
      val => this._transactionService.getTransaction(+[val])
        .subscribe((p) => this.stockItem = p),
      (err) => console.error(err)
    );
    this._transactionService.getDrugs().subscribe(d => this.drugsList = d);
    this._transactionService.getItems().subscribe(i => this.storeItems = i);
    this._transactionService.getStores().subscribe(z => this.storesList = z);
    // console.log(this.rows.controls[0] + 'index: ' + this.index);
  }

  buildRow(): FormGroup {
    return this.fb.group({
      drug_id: ['', Validators.required],
      unit: '',
      pack_size: '',
      batch_number: '',
      expiry_date: '',
      quantity_packs: ['', Validators.required],
      quantity: '',
      balance_before: '',
      unit_cost: '',
      total: '',
      comment: ''
    });
  }

  setDate(value: any, val: string) {
    this.stockTransactionsForm.patchValue({
      transaction_time: value
    });
  }

  setStore(value: any) {
    let a = this.storesList.find(val => val['name'] === value);
    if (a) {
      this.stockTransactionsForm.patchValue({
        store_id: a['id']
      });
    }
  }

  addRow() {
    this.rows.push(this.buildRow());
  }

  removeRow(i: number) {
    const control = <FormArray>this.stockTransactionsForm.controls['drugs'];
    control.removeAt(i);
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
    this.i = val;
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
        balance_before: batch.balance,
        comment: batch.comment
      }
    );
  }

  ngDoCheck() {
    if (this.i != null) {
      let currentRow = this.rows.controls[this.i].value;
      let p = currentRow.quantity_packs;
      let pc = currentRow.unit_cost;
      let ps = currentRow.pack_size;
      let aq = currentRow.quantity;
      let q = currentRow.balance_before;
      this.rows.controls[this.i].patchValue({
        total: (p * pc),
        quantity: (ps * p)
      });
    }
  }

  // VALIDATORS

  quantityValidator(packs: number, val: number) {
    let q = this.rows.controls[+[val]].value.quantity;
    let aq = this.rows.controls[+[val]].value.balance_before;
    if ((packs * q) > aq) {
      this.errorAlert('Quantity entered is greater than Available Quantity');
    }
  }

  smartAlert(content: string, type: string, optional: number = null) {
    $.SmartMessageBox({
      title: `webADT Alert: ${content} `,
      buttons: '[No][Yes]'
    }, (buttonPressed) => {
      if (buttonPressed === 'Yes') {
        if (type === 'delete_row' && optional) {
          this.removeRow(optional);
        }
        else if (type === 'reset') {
          this.stockTransactionsForm.reset();
        }
      }
    });
  }

  errorAlert(value: string) {
    $.smallBox({
      title: 'Error Alert',
      content: value,
      color: '#C46A69',
      icon: 'fa fa-warning shake animated',
      timeout: 6000
    });
  }

  onSubmit(): void {
    this._transactionService.addTransaction(this.stockTransactionsForm.value).subscribe(
      () => this.onSaveComplete(),
      (error) => {
        console.log('Error happened: ' + JSON.stringify(error));
      }
    );
  }

  onSaveComplete() {
    console.log('Created a new Transaction');
    this.router.navigateByUrl('/inventory/inventory-management');
  }
}
