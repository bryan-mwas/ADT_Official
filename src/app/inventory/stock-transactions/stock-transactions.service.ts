import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Transaction, StockItem, Drug, Types, StoreItem } from './transactions';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class StockTransactionsService {

  // private _apiUrl = 'http://192.168.133.10/adt-core/lib/public/api/';
  private _apiUrl = 'http://41.89.6.210/adt-core/lib/public/api/';
  // private _apiUrl = 'http://197.232.32.34/adt/api/';

  private _transactionApi = this._apiUrl + 'stock';
  private _drugsApi = this._apiUrl + 'drugs';
  private _typesApi = this._apiUrl + 'lists/transaction_type';
  private _itemsApi = this._apiUrl + 'stock/store';

  constructor(private _http: Http) { }

  // GET

  getTransactionTypes() {
    return this._http.get(this._typesApi)
      .map((response: Response) => <Types[]>response.json())
      .catch(this.handleError);
  }

  getTransaction(id: number): Observable<any> {
    return this.getTransactionTypes()
      .map((transaction: Transaction[]) => transaction.find(p => p.id === id))
      .do(data => console.log('transaction: ' + JSON.stringify(data)));
  }

  getDrugs() {
    return this._http.get(this._drugsApi)
      .map((response: Response) => <Drug[]>response.json())
      .do(data => console.log('DrugsList: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDrugDetails(id: number): Observable<any> {
    return this._http.get(this._drugsApi + `/${id}`)
      .map((response: Response) => <Drug[]>response.json())
      // .do(data=> console.log('IndividualDrugDetails: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getItems(): Observable<any> {
    return this._http.get(this._itemsApi)
      .map((response: Response) => <StoreItem[]>response.json())
      .do(data => console.log('Store Items: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDrugBatches(storeId: number, drugId: number): Observable<any> {
    return this._http.get(this._itemsApi + `/${storeId}` + '/drug/' + `${drugId}`)
      .map((response: Response) => <StoreItem[]>response.json())
      .do(data => console.log('Store Item by Drug ID: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  // Error Handling

  private handleError(error: Response) {
    let msg = `Status code ${error.status} on url ${error.url}`;
    console.error(msg);
    return Observable.throw(msg);
  }

}
