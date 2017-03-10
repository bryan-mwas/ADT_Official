import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  i: number; // Index Tracker
  store = new Store();
  individualDrug: any = null;
  transaction: Transaction;
  // stockItem: Transaction;
  drugItem: Drug;
  private storesList: Observable<string[]>;
  private transactionTypes: Transaction[];
  private drugsList: Observable<string[]>;
  private storeDrugs: Observable<string[]>;
  private storeItems: StoreItem;
  private batchList: Observable<string[]>;
  private indiv: Observable<string[]>;

  constructor(
    private _fb: FormBuilder,
    private _transactionService: StockTransactionsService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this._route.params
      .switchMap((params: Params) => this._transactionService.thisStore(+params['id']))
      .subscribe(store => this.store = store);
    this.stockTransactionsForm = this._fb.group({
      transaction_date: ['', Validators.required],
      transaction_type_id: ['', Validators.required],
      ref_number: ['', Validators.required],
      store_id: '',
      store: '',
      drugs: this._fb.array([this.buildRow()]),
    });
    this._transactionService.getTransactionTypes().subscribe(data => this.transactionTypes = data);
    // this.stockTransactionsForm.get('transaction_type_id').valueChanges.subscribe(
    //   val => this._transactionService.getTransaction(+[val]).subscribe((p) => this.transaction = p),
    //   (err) => console.error(err),
    // );
    this._transactionService.getDrugs().subscribe(d => this.drugsList = d);
    this._transactionService.getItems().subscribe(i => this.storeItems = i);
    this._transactionService.getStores().subscribe(z => this.storesList = z);
    // console.log(this.rows.controls[0] + 'index: ' + this.index);
  }

  buildRow(): FormGroup {
    return this._fb.group({
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

  // FormGroup Methods

  get rows(): FormArray {
    return <FormArray>this.stockTransactionsForm.get('drugs');
  }

  addRow() {
    this.rows.push(this.buildRow());
  }

  removeRow(i: number) {
    const control = <FormArray>this.stockTransactionsForm.controls['drugs'];
    control.removeAt(i);
  }

  index(val: any) {
    this.i = val;
  }

  // DatePicker Methods

  setDate(value: any, val: string) {
    this.stockTransactionsForm.patchValue({
      transaction_date: value
    });
  }

  setEDate(value: any, index: number) {
    this.rows.controls[+[index]].patchValue({
      expiry_date: value
    });
  }

  // Source/Destination Method

  setStore(value: any) {
    let a = this.storesList.find(val => val['name'] === value);
    if (a) {
      this.stockTransactionsForm.controls['store_id'].enable();
      this.stockTransactionsForm.patchValue({
        store_id: a['id']
      });
    } else {
      this.stockTransactionsForm.controls['store_id'].disable();
    }
  }

  // List Changers

  getStoreDrugs(value: number, index: number) {
    let e = this.transactionTypes.find(val => val.id === +[value]);
    if (+[e['effect']] === 0) {
      // alert(e);
      this._route.params
        .switchMap((params: Params) => this._transactionService.getDrugsbyStore(+params['id']))
        .subscribe(z => this.storeDrugs = z);
    } else {
      this.rows.controls[+[index]].reset();
      this._transactionService.getDrugs().subscribe(d => this.storeDrugs = d);
    }
  }

  getSDDetails() {
    if (this.storeDrugs != undefined) {
      let b: any = this.storeDrugs.find(val => val['drug_id']);
      console.log(JSON.stringify(b));
    }
  }

  getIndividualDrug(id: number, index: number) {
    this._transactionService.getDrugDetails(+[id]).subscribe(
      individualDrug => this.patchRow(individualDrug, index)
    );
    this._transactionService.getDrugBatches(1, +[id]).subscribe(i => this.batchList = i);
  }

  // getBatchDetails(batchNo: string, index: number) {
  //   let b = this.batchList.find(val => val[''] === batchNo);
  //   if (b) {
  //     this._transactionService.getDrugBatchDetails(1, batchNo).subscribe(
  //       individualBatch => this.patchBatch(individualBatch, index)
  //     );
  //   } else {
  //     this.rows.controls[+[index]].patchValue({
  //       batch_number: batchNo
  //     });
  //   }
  // }

  // Patch Methods

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

  // Validators and Notifications

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

  successNotification() {
    $.smallBox({
      title: 'Success',
      // content: 'Your data was successfully saved',
      color: '#296191',
      iconSmall: 'fa fa-thumbs-up shake animated',
      timeout: 4000
    });
  }

  // Posting

  onSubmit(): void {
    this._route.params
      .switchMap((params: Params) => this._transactionService.addTransaction(this.stockTransactionsForm.value, +params['id'])).subscribe(
      () => this.onSaveComplete(),
      (error) => {
        console.log('Error happened: ' + JSON.stringify(error));
      }
      );
  }

  onSaveComplete() {
    console.log('Created a new Transaction');
    this.successNotification();
    this._router.navigateByUrl('/inventory/inventory-management');
  }

  // Yucky Zone

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
    // if (this.stockTransactionsForm.get('transaction_type_id').valueChanges) {
    //   console.log(JSON.stringify(this.transaction));
    //   if (this.transaction) {
    //     if (this.transaction['effect'] === 0) {
    //       this._route.params
    //         .switchMap((params: Params) => this._transactionService.getDrugsbyStore(+params['id']))
    //         .subscribe(z => this.storeDrugs = z);
    //       this._transactionService.getDrugDetails(this.storeDrugs['drug_id']).subscribe(p => this.drugsList = p);
    //     }
    //   }
    // }
  }

}
