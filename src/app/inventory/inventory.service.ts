import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IDrugs, IStockDrug } from './drugs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class InventoryService {
    protected apiUrl = 'http://197.232.32.34/adt/api/';
    constructor(private http: Http) { }

    getPaginatedDrugs(id: number) {
        return this.http.get(`${this.apiUrl}/drugs?page=${id}`)
            .map((response: Response) => <IDrugs[]>response.json())
            // .do(data => console.log('All: ' + JSON.stringify(data)))z
            .catch(this.handleError);
    }

    getDrugs(): Observable<IDrugs[]> {
        return this.http.get(this.apiUrl)
            .map((response: Response) => <IDrugs[]>response.json())
            .do(data => console.log('getDrugs: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getStockDrug(id: number): Observable<any[]> {
        return this.http.get(`${this.apiUrl}stock/${id}/bincard`)
            .map((response: Response) => <any[]>response.json())
            .do(data => console.log('getIndividualDrug: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}