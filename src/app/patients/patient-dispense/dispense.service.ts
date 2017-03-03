import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { CONFIG } from '../../core/config';

import { Regimen } from '../patients';

@Injectable()
export class DispenseService {

    // private _apiUrl = 'assets/api/patients/dispense.dummy.json';
    private _url = CONFIG.baseUrl;

    constructor(private _http: Http) { }

    /**
     * GET
     */
    getDrugDetails(id: number): Observable<any> {
    return this._http.get(this._url + `/drugs/${id}`)
      .map((response: Response) => <any[]>response.json())
      .do(data => console.log('IndividualDrugDetails: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }
    getRegimens() {
        return this._http.get(this._url + '/regimen')
            .map((res: Response) => <any[]>res.json()) // TODO: refactor this. Bad practice
            .do(data => console.log('Change Reasons: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    getChangeReason() {
        return this._http.get(this._url + '/lists/changereason')
            .map((res: Response) => <any[]>res.json()) // TODO: refactor this. Bad practice
            .do(data => console.log('Change Reasons: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    getPurpose() {
        return this._http.get(this._url + '/lists/purpose')
            .map((res: Response) => <any[]>res.json()) // TODO: refactor this. Bad practice
            .do(data => console.log('Purpose: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    getNonAdherence() {
        return this._http.get(this._url + '/lists/nonaadherencereason')
            .map((res: Response) => <any[]>res.json()) // TODO: refactor this. Bad practice
            .do(data => console.log('Non Adherance: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    getRegimenDrugs(id: number) {
        return this._http.get(this._url + `/regimen/${id}/drugs`)
            .map((res: Response) => <any[]>res.json()) // TODO: refactor this. Bad practice
            .do(data => console.log('Regimen Drugs: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    /**
     * GETS the batch number and expiry date
     * @param store_id 
     * @param drug_id 
     */
    getDrugBatch(store_id: number, drug_id: number) {
        return this._http.get(this._url + `/stock/store/${store_id}/drug/${drug_id}`)
            .map((res: Response) => <any[]>res.json()) // TODO: refactor this. Bad practice
            .do(data => console.log('Batch: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    // Loops through the lists of services to get individual service properties
    // such as different regimens

    // getRegimen(id: number): Observable<any> {
    //     return this.getRegimenDrugs()
    //         .map((service: Regimen[]) => service.find(regimen => regimen.id === id))
    //         .do(data => console.log('Service: ' + JSON.stringify(data)));
    // }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let msg = `Status code ${error.status} on url ${error.url}`;
        console.error(msg);
        return Observable.throw(msg);
    }
    /**
     * POST Section
     */
    saveDispenseDetails(body: Object) {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.post(`${this._url}/${body['patient_id']}/dispense`, body, options) // ...using put request
            .map(() => body)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if a
    }
}