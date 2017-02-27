import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Facility, Counties, Types, SubCounties, Services, Sources, Supporters, User, AccessLevel } from './facility';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FacilityService {

    private _apiUrl = 'http://192.168.133.10/adt-core/lib/public/api/';

    private _faciltyApi = this._apiUrl + 'facility';
    private _countiesApi = this._apiUrl + 'lists/counties';
    private _typesApi = this._apiUrl + 'lists/facilty_type';
    private _subcountiesApi = this._apiUrl + 'lists/sub_county';
    private _servicesApi = this._apiUrl + 'lists/services';
    private _sourcesApi = this._apiUrl + 'lists/patientsources';
    private _supportersApi = this._apiUrl + 'lists/supporter';
    private _usersApi = this._apiUrl + 'users';
    private _usertypesApi = this._apiUrl + 'lists/access_level';

    constructor(private _http: Http) { }

    // Get

    getFacilityDetails(id: number) {
        return this._http.get(this._faciltyApi + `/${id}`)
            .map((response: Response) => <Facility[]>response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getFacilityUsers() {
        return this._http.get(this._usersApi)
            .map((response: Response) => <User[]>response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getCounties() {
        return this._http.get(this._countiesApi)
            .map((response: Response) => <Counties[]>response.json())
            .catch(this.handleError);
    }

    getSubcounties() {
        return this._http.get(this._subcountiesApi)
            .map((response: Response) => <SubCounties[]>response.json())
            .catch(this.handleError);
    }

    getFacilityTypes() {
        return this._http.get(this._typesApi)
            .map((response: Response) => <Types[]>response.json())
            .catch(this.handleError);
    }

    getServices() {
        return this._http.get(this._servicesApi)
            .map((response: Response) => <Services[]>response.json())
            .catch(this.handleError);
    }

    getSources() {
        return this._http.get(this._sourcesApi)
            .map((response: Response) => <Sources[]>response.json())
            .catch(this.handleError);
    }

    getSupporters() {
        return this._http.get(this._supportersApi)
            .map((response: Response) => <Supporters[]>response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getAccessLevels() {
        return this._http.get(this._usertypesApi)
            .map((response: Response) => <AccessLevel[]>response.json())
            .catch(this.handleError);
    }

    // Put

    updateFacility(body: Object): Observable<Facility> {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.put(`${this._faciltyApi}/${body['id']}`, body, options) // ...using put request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if a
    }
    
    updateFacilityUser(body: Object): Observable<User[]> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.put(`${this._usersApi}/${body['id']}`, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    updatePatientSource(body: Object): Observable<Sources[]> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.put(`${this._sourcesApi}/${body['id']}`, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    updateSupporter(body: Object): Observable<Supporters[]> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.put(`${this._supportersApi}/${body['id']}`, body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Post
    addFacilityUser(body: Object): Observable<User[]> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this._usersApi, body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    addPatientSource(body: Object): Observable<Sources[]> {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.post(this._sourcesApi, body, options) // ...using post request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    addSupporter(body: Object): Observable<Supporters[]> {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.post(this._supportersApi, body, options) // ...using post request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    // Delete

    disableSource(id: string): Observable<Sources> {
        return this._http.delete(`${this._sourcesApi}/${id}`)
            .map(() => { })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    disableSupporter(id: string): Observable<Supporters> {
        return this._http.delete(`${this._supportersApi}/${id}`)
            .map(() => { })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    disableUser(id: string): Observable<User> {
        return this._http.delete(`${this._usersApi}/${id}`)
            .map(() => { })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Error Handling

    private handleError(error: Response) {
        let msg = `Status code ${error.status} on url ${error.url}`;
        console.error(msg);
        return Observable.throw(msg);
    }
}