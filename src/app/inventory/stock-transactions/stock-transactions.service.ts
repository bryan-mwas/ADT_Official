import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Transaction, StockItem, Drug, Types, StoreItem, Store } from './transactions';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { CONFIG } from '../../core/config';

@Injectable()
export class StockTransactionsService {

  // private _apiUrl = CONFIG.baseUrl;
  private _apiUrl = CONFIG.alternateUrl;

  private _transactionApi = this._apiUrl + 'stock';
  private _drugsApi = this._apiUrl + 'drugs';
  private _typesApi = this._apiUrl + 'lists/transaction_type';
  private _itemsApi = this._apiUrl + 'stock/store';
  private _storesApi = this._apiUrl + 'stores';
  private _storeURL = this._apiUrl + 'store';

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
      .do(data => console.log('transaction: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDrugs() {
    return this._http.get(this._drugsApi)
      .map((response: Response) => <Drug[]>response.json())
      .catch(this.handleError);
  }

  getDrugDetails(id: number): Observable<any> {
    return this._http.get(this._drugsApi + `/${id}`)
      .map((response: Response) => <Drug[]>response.json())
      // .do(data => console.log('lol: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDrugsbyStore(storeId: number): Observable<any> {
    return this._http.get(this._storeURL + `/${storeId}` + '/stock/drug')
      .map((response: Response) => <StockItem[]>response.json())
      .do(data => console.log('drugs in store: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getItems(): Observable<any> {
    return this._http.get(this._itemsApi)
      .map((response: Response) => <StoreItem[]>response.json())
      .catch(this.handleError);
  }

  getStoreItems(id: number): Observable<any> {
    return this._http.get(this._itemsApi + `/${id}`)
      .map((response: Response) => <StoreItem[]>response.json())
      .catch(this.handleError);
  }

  getDrugBatches(storeId: number, drugId: number): Observable<any> {
    return this._http.get(this._storeURL + `/${storeId}` + '/stock/drug/' + `${drugId}`)
      .map((response: Response) => <StoreItem[]>response.json())
      .catch(this.handleError);
  }

  // getDrugBatchDetails(storeId: number, batchNo: string): Observable<any> {
  //   return this.getStoreItems(storeId)
  //     .map((storeItem: StoreItem[]) => storeItem.find(b => b.batch_number === batchNo))
  //     .catch(this.handleError);
  // }

  thisStore(id: number) {
    return this._http.get(this._storesApi + `/${id}`)
      .map((response: Response) => <Store[]>response.json())
      // .do(data => console.log('HERE : ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getStores() {
    return this._http.get(this._storesApi)
      .map((response: Response) => <Store[]>response.json())
      // .do(data => console.log('stores: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  // POST

  addTransaction(body: Object, id: number): Observable<StockItem[]> {
    let bodyString = JSON.stringify(body); // Stringify payload
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.post(this._storeURL + `/${id}` + '/stock', body, options)
      .map(() => body) // ...and calling .json() on the response to return data
      .catch(this.handleError); // ...errors if any
  }

  // Error Handling

  private handleError(error: Response) {
    let msg = `Status code ${error.status} on url ${error.url}`;
    console.error(msg);
    return Observable.throw(msg);
  }

}
