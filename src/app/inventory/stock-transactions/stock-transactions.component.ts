import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Types, Transaction, StockItem, Drug, StoreItem, Store } from './transactions';
import { StockTransactionsService } from './stock-transactions.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeWhile';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
  selector: 'app-stock-transactions',
  templateUrl: './stock-transactions.component.html',
  styleUrls: ['./stock-transactions.component.css'],
  providers: [StockTransactionsService, DatePipe]
})
export class StockTransactionsComponent implements OnInit, DoCheck, OnDestroy {

  stockTransactionsForm: FormGroup;
  i: number; // Index Tracker
  store = new Store();
  individualDrug: any = null;
  transaction: Transaction;
  // stockItem: Transaction;
  drugItem: Drug;
  eDateOptions: Object = {
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    yearRange: 'c:c+20',
    minDate: new Date()
  }
  dateOptions: Object = {
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    // minDate: new Date(),
    beforeShowDay: $.datepicker.noWeekends
  };
  private negative: boolean = true;
  private storesList: Observable<string[]>;
  private transactionTypes: Transaction[];
  private drugsList: Observable<string[]>;
  private allBatches: Observable<string[]>;
  // private storeItems: StoreItem;
  private batchList: Observable<string[]>;
  private indiv: Observable<string[]>;

  constructor(
    private _fb: FormBuilder,
    private _transactionService: StockTransactionsService,
    private _route: ActivatedRoute,
    private _datePipe: DatePipe,
    private _router: Router) {
      _route.params.subscribe(params => this.ngOnInit());
     }

  ngOnInit() {
    this._route.params
      .switchMap((params: Params) => this._transactionService.thisStore(+params['id']))
      .subscribe(store => this.store = store);
    this.stockTransactionsForm = this._fb.group({
      transaction_date: [this.today, Validators.required],
      transaction_type_id: ['', Validators.required],
      ref_number: ['', Validators.required],
      store_id: '',
      store: '',
      drugs: this._fb.array([this.buildRow()]),
    });
    this._transactionService.getTransactionTypes().subscribe(data => this.transactionTypes = data);
    this._transactionService.getStores().subscribe(z => this.storesList = z);
  }

  ngOnDestroy(){
    confirm('Are you sure you want to leave this page?');
  }

  buildRow(): FormGroup {
    return this._fb.group({
      drug_id: ['', Validators.required],
      unit: '',
      pack_size: '',
      batch_number: '',
      expiry_date: '',
      quantity_packs: ['', Validators.pattern('^[0-9]*[1-9][0-9]*$')],
      quantity: '',
      balance_before: '',
      unit_cost: ['', Validators.pattern('^[0-9]*[1-9][0-9]*$')],
      total: '',
      comment: ''
    });
  }

  // FormGroup Methods

  get rows(): FormArray {
    return <FormArray>this.stockTransactionsForm.get('drugs');
  }

  get today() {
    let today = new Date();
    return this._datePipe.transform(today, 'y-MM-dd');
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

  setEDate(value: Date, index: number) {
    let today = new Date();
    let eDate = new Date(value);
    let eDateMS = eDate.getTime();
    if (eDateMS - today.getTime() < 15552000000) {
      this.errorAlert('The expiry date updated is within 6 months!');
    }
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
    this.rows.controls[+[index]].reset();
    let e = this.transactionTypes.find(val => val.id === +[value]);
    if (+[e['effect']] === 0) {
      this.negative = true;
      this._route.params
        .switchMap((params: Params) => this._transactionService.getDrugsbyStore(+params['id']))
        .subscribe(z => this.drugsList = z);
    } else {
      this.rows.controls[+[index]].reset();
      this._transactionService.getDrugs().subscribe(d => this.drugsList = d);
      this.negative = false;
    }
    if (this.rows.get('store').value !== null || this.rows.get('store_id').value !== null) {
      this.rows.get('store').reset();
      this.rows.get('store_id').reset();
    }
  }

  getIndividualDrug(id: number, index: number) {
    this._transactionService.getDrugDetails(+[id]).subscribe(
      individualDrug => this.patchRow(individualDrug, index)
    );
    this._route.params
      .switchMap((params: Params) => this._transactionService.getDrugBatches(+params['id'], +[id]))
      .takeWhile(() => this.negative === true)
      .subscribe(i => this.batchList = i);
    this._route.params
        .switchMap((params: Params) => this._transactionService.getBatchDetails(+params['id'], this.rows.get(`${index}.drug_id`).value))
        .takeWhile(() => this.negative === true)
        .subscribe(p => this.allBatches = p);
  }

  getBatchDetails(batchNo: string, index: number) {
    let b = this.allBatches.find(val => val['batch_number'] === batchNo);
    if (b && this.negative === true) {
      this.patchBatch(b, index);
    }
  }

  // Patch Methods

  patchRow(drug: any, val: number) {
    this.rows.controls[+[val]].patchValue(
      {
        unit: drug.drug_unit,
        pack_size: drug.pack_size,
      }
    );
    this.rows.get(`${val}.batch_number`).reset();
    this.rows.get(`${val}.expiry_date`).reset();
    this.rows.get(`${val}.balance_before`).reset();
    this.rows.get(`${val}.unit_cost`).reset();
  }

  patchBatch(batch: any, val: number) {
    this.rows.controls[+[val]].patchValue(
      {
        expiry_date: batch.expiry_date,
        balance_before: batch.balance_after
      }
    );
    if (this.rows.get(`${val}.expiry_date`).value !== null) {
      let today = new Date();
      let eDate = new Date(this.rows.get(`${val}.expiry_date`).value);
      let eDateMS = eDate.getTime();
      // console.log('1: ' + today + '2: ' + eDate, eDateMS - today.getTime());
      if (eDateMS - today.getTime() < 15552000000) {
        this.errorAlert('The drug being transacted expires within 6 months!');
      }
    }
  }

  // Validators and Notifications

  quantityValidator(packs: number, val: number) {
    if (this.rows.get(`${val}.quantity_packs`).errors) {
      this.errorAlert('Please enter a valid number');
    }
    if (this.rows.get(`${val}.balance_before`).value !== null && (+[packs] * this.rows.controls[+[val]].value.pack_size) > this.rows.controls[+[val]].value.balance_before) {
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
    this._router.navigateByUrl(`/inventory/inventory-management/${this.store.id}`);
  }

  quantityCalculator(val: any, index: number) {
    let currentRow = this.rows.controls[index].value;
    this.rows.controls[index].patchValue({
      quantity: (currentRow.quantity_packs * currentRow.pack_size)
    });
  }

  totalCalculator(val: any, index: number) {
    this.rows.controls[index].patchValue({
      total: (this.rows.get(`${index}.quantity_packs`).value * this.rows.get(`${index}.unit_cost`).value)
    });
  }

  // Yucky Zone

  ngDoCheck() {
    // console.log(this.negative)
  }
}
