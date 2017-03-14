import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Order, Facility } from './orders'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class OrdersService {

  private _apiUrl = 'http://192.168.33.10/adt-core/lib/public/api/';

  private _cdrrApi = this._apiUrl + 'cdrr';
  private _mapsApi = this._apiUrl + 'maps';
  private _facilitiesApi = this._apiUrl + 'facility';

  constructor(private _http: Http) { }

  // Get

  getCdrrOrderDetails() {
    return this._http.get(this._cdrrApi)
      .map((response: Response) => <Order[]>response.json())
      .do(data => console.log('All CDRRs: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getMapOrderDetails() {
    return this._http.get(this._mapsApi)
      .map((response: Response) => <Order[]>response.json())
      .do(data => console.log('All MAPs: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getFacilityDetails() {
    return this._http.get(this._facilitiesApi)
      .map((response: Response) => <Facility[]>response.json())
      .do(data => console.log('Facilities: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  // Error Handling

  private handleError(error: Response) {
    let msg = `Status code ${error.status} on url ${error.url}`;
    console.error(msg);
    return Observable.throw(msg);
  }

}
