import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IDrugs, IStockDrug, Store, StockDrugs } from './drugs';
import { CONFIG } from '../core/config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class InventoryService {

    protected _apiUrl = CONFIG.alternateUrl;

    private _storesApi = this._apiUrl + 'stores';

    constructor(private _http: Http) { }

    getDrugs(): Observable<IDrugs[]> {
        return this._http.get(this._apiUrl + 'drugs')
            .map((response: Response) => <IDrugs[]>response.json())
            // .do(data => console.log('getDrugs: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getDrugTransactions(storeId: number, id: number): Observable<any[]> {
        return this._http.get(`${this._apiUrl}stores/${storeId}/stocks/drugs/${id}/all`)
            .map((response: Response) => <any[]>response.json())
            .do(data => console.log('Transaction Details: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getViableBatches(storeId: number, drugId: number): Observable<any[]> {
        return this._http.get(`${this._apiUrl}stores/${storeId}/stocks/drugs/${drugId}/now`)
            .map((response: Response) => <any[]>response.json())
            .do(data => console.log('Viable Batch Details: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    thisStore(id: number) {
        return this._http.get(this._storesApi + `/${id}`)
            .map((response: Response) => <Store[]>response.json())
            // .do(data => console.log('HERE : ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getDrugsbyStore(storeId: number): Observable<any> {
    return this._http.get(this._apiUrl + 'stores' + `/${storeId}` + '/stocks/drugs')
      .map((response: Response) => <StockDrugs[]>response.json())
    //   .do(data => console.log('drugs in store: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

    private handleError(error: Response) {
        let msg = `Status code ${error.status} on url ${error.url}`;
        console.error(msg);
        return Observable.throw(msg);
    }
}
